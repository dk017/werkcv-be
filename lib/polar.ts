import { getEditorPathForLanguage, getSuccessPathForLanguage } from "@/lib/editor-path";
import { ResumeLanguage } from "@/lib/resume-language";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
const POLAR_ACCESS_TOKEN = process.env.POLAR_ACCESS_TOKEN;
const POLAR_PRODUCT_ID =
    process.env.POLAR_PRODUCT_ID_CV_DOWNLOAD || process.env.POLAR_PRODUCT_ID;
const POLAR_PRICE_ID = process.env.POLAR_PRICE_ID_CV_DOWNLOAD;
const POLAR_PRODUCT_ID_PROFILE_PHOTO =
    process.env.POLAR_PRODUCT_ID_PROFILE_PHOTO || 'b60c9ea3-69ec-4c2b-aa2c-a0831a315e7c';
const POLAR_PRODUCT_ID_CV_PROFILE_BUNDLE = process.env.POLAR_PRODUCT_ID_CV_PROFILE_BUNDLE;
const POLAR_PRICE_ID_CV_PROFILE_BUNDLE = process.env.POLAR_PRICE_ID_CV_PROFILE_BUNDLE;
const POLAR_CHECKOUT_CURRENCY = 'eur';
const POLAR_SERVER = process.env.POLAR_SERVER === 'sandbox' ? 'sandbox' : 'production';

const POLAR_API_BASE = POLAR_SERVER === 'sandbox'
    ? 'https://sandbox-api.polar.sh'
    : 'https://api.polar.sh';

const SUPPORTED_ADDONS = ['ats-rewrite', 'cover-letter', 'localization-polish'] as const;
export type CheckoutAddon = typeof SUPPORTED_ADDONS[number];
export const CV_DOWNLOAD_PRODUCT = 'cv-download';
export const CV_PROFILE_PHOTO_BUNDLE_PRODUCT = 'cv-profile-photo-bundle';
const SUPPORTED_CHECKOUT_PRODUCTS = [CV_DOWNLOAD_PRODUCT, CV_PROFILE_PHOTO_BUNDLE_PRODUCT] as const;
export type CheckoutProduct = typeof SUPPORTED_CHECKOUT_PRODUCTS[number];

function isCheckoutAddon(value: string): value is CheckoutAddon {
    return SUPPORTED_ADDONS.includes(value as CheckoutAddon);
}

function isCheckoutProduct(value: string): value is CheckoutProduct {
    return SUPPORTED_CHECKOUT_PRODUCTS.includes(value as CheckoutProduct);
}

function uniqueAddons(addons: CheckoutAddon[]): CheckoutAddon[] {
    return [...new Set(addons)];
}

export function parseCheckoutAddons(input: unknown): CheckoutAddon[] {
    if (!Array.isArray(input)) return [];
    return uniqueAddons(
        input
            .filter((value): value is string => typeof value === 'string')
            .map((value) => value.trim())
            .filter(isCheckoutAddon)
    );
}

export function parseCheckoutProduct(input: unknown): CheckoutProduct {
    if (typeof input !== 'string') return CV_DOWNLOAD_PRODUCT;
    const trimmed = input.trim();
    return isCheckoutProduct(trimmed) ? trimmed : CV_DOWNLOAD_PRODUCT;
}

function appendBundleSuccessParam(path: string, checkoutProduct: CheckoutProduct): string {
    if (checkoutProduct !== CV_PROFILE_PHOTO_BUNDLE_PRODUCT) return path;

    const [pathname, queryString = ''] = path.split('?');
    const params = new URLSearchParams(queryString);
    params.set('bundle', 'profile-photo');
    return `${pathname}?${params.toString()}`;
}

export async function buildCheckoutURL(
    cvId: string,
    email?: string,
    selectedAddons: CheckoutAddon[] = [],
    resumeLanguage: ResumeLanguage = "nl",
    checkoutProduct: CheckoutProduct = CV_DOWNLOAD_PRODUCT
): Promise<string> {
    if (!POLAR_ACCESS_TOKEN) {
        throw new Error('POLAR_ACCESS_TOKEN is not configured');
    }
    if (checkoutProduct === CV_DOWNLOAD_PRODUCT && !POLAR_PRODUCT_ID && !POLAR_PRICE_ID) {
        throw new Error('POLAR_PRODUCT_ID_CV_DOWNLOAD or POLAR_PRICE_ID_CV_DOWNLOAD is not configured');
    }
    if (
        checkoutProduct === CV_PROFILE_PHOTO_BUNDLE_PRODUCT &&
        !POLAR_PRODUCT_ID_CV_PROFILE_BUNDLE &&
        !POLAR_PRICE_ID_CV_PROFILE_BUNDLE
    ) {
        throw new Error('POLAR_PRODUCT_ID_CV_PROFILE_BUNDLE or POLAR_PRICE_ID_CV_PROFILE_BUNDLE is not configured');
    }

    const addons = uniqueAddons(selectedAddons);

    const metadata: Record<string, string> = { cv_id: cvId, product: checkoutProduct };
    if (addons.length > 0) {
        metadata.addons_csv = addons.join(',');
    }

    const successPath = appendBundleSuccessParam(
        getSuccessPathForLanguage(resumeLanguage, cvId),
        checkoutProduct
    );
    const body: Record<string, unknown> = {
        success_url: `${APP_URL}${successPath}`,
        return_url: `${APP_URL}${getEditorPathForLanguage(resumeLanguage, cvId)}`,
        currency: POLAR_CHECKOUT_CURRENCY,
        metadata,
    };

    const productId =
        checkoutProduct === CV_PROFILE_PHOTO_BUNDLE_PRODUCT
            ? POLAR_PRODUCT_ID_CV_PROFILE_BUNDLE
            : POLAR_PRODUCT_ID;
    const priceId =
        checkoutProduct === CV_PROFILE_PHOTO_BUNDLE_PRODUCT
            ? POLAR_PRICE_ID_CV_PROFILE_BUNDLE
            : POLAR_PRICE_ID;

    if (priceId) {
        body.product_price_id = priceId;
    } else {
        body.products = [productId];
    }

    if (email) {
        body.customer_email = email;
    }

    const createCheckout = (checkoutBody: Record<string, unknown>) => fetch(`${POLAR_API_BASE}/v1/checkouts/`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${POLAR_ACCESS_TOKEN}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(checkoutBody),
    });

    let res = await createCheckout(body);
    if (!res.ok && priceId && productId) {
        const error = await res.text();
        if (error.includes('Price is archived') || error.includes('product_price_id')) {
            const fallbackBody = { ...body };
            delete fallbackBody.product_price_id;
            fallbackBody.products = [productId];
            res = await createCheckout(fallbackBody);
        } else {
            throw new Error(`Polar checkout failed (${res.status}): ${error}`);
        }
    }

    if (!res.ok) {
        const error = await res.text();
        throw new Error(`Polar checkout failed (${res.status}): ${error}`);
    }

    const checkout = await res.json() as { url?: string };

    if (!checkout.url) {
        throw new Error('Polar checkout URL is missing from response');
    }

    return checkout.url;
}

export async function buildProfilePhotoCheckoutURL(projectId: string, email: string): Promise<string> {
    if (!POLAR_ACCESS_TOKEN) {
        throw new Error('POLAR_ACCESS_TOKEN is not configured');
    }
    if (!POLAR_PRODUCT_ID_PROFILE_PHOTO) {
        throw new Error('POLAR_PRODUCT_ID_PROFILE_PHOTO is not configured');
    }

    const body: Record<string, unknown> = {
        success_url: `${APP_URL}/profielfoto-cv-maken?project=${encodeURIComponent(projectId)}&paid=1#profielfoto-tool`,
        return_url: `${APP_URL}/profielfoto-cv-maken#profielfoto-tool`,
        currency: POLAR_CHECKOUT_CURRENCY,
        products: [POLAR_PRODUCT_ID_PROFILE_PHOTO],
        customer_email: email,
        metadata: {
            product: 'profile-photo',
            project_id: projectId,
        },
    };

    const res = await fetch(`${POLAR_API_BASE}/v1/checkouts/`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${POLAR_ACCESS_TOKEN}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });

    if (!res.ok) {
        const error = await res.text();
        throw new Error(`Polar profile photo checkout failed (${res.status}): ${error}`);
    }

    const checkout = await res.json() as { url?: string };

    if (!checkout.url) {
        throw new Error('Polar profile photo checkout URL is missing from response');
    }

    return checkout.url;
}
