/**
 * This file was automatically generated using the
 * frontstack CLI, please do not edit it manually!
 */

import type { components } from './fetch-api.d.ts'

type RequestOptions = {
    /**
     * @description URL to the current page
     *
     * Optionally, frontstack accepts a URL to the current page. This is useful for tracking purposes.
     */
    requestUrl?: string

    /**
     * @description Context key
     *
     * Providing a context key will override the default context key for the request
     */
    contextKey?: string
}

/* List of all types used to fetch block parameters */

export type AllProductsListingParameters = {
}

export type CategoryListingParameters = {
}

export type ProductsByCategoryListingParameters = {
    /**
     * @description Description missing for categoryId
     */
    categoryId: string;
}


/* List of all blocks, used for IDE autocompletion */

type ListingParameters = {
    AllProductsListing: AllProductsListingParameters
    CategoryListing: CategoryListingParameters
    ProductsByCategoryListing: ProductsByCategoryListingParameters
}

type Endpoints = {
    [key in keyof Listings | keyof Blocks]: string;
}

/* Types for split block/listing methods */
export type Blocks = {
    CategoryCard: never
    ProductCard: never
}

export type Listings = {
    AllProductsListing: AllProductsListingParameters
    CategoryListing: CategoryListingParameters
    ProductsByCategoryListing: ProductsByCategoryListingParameters
}

declare global {
export type AllProductsListing = components['schemas']['AllProductsListing']
export type CategoryCard = components['schemas']['CategoryCard']
export type CategoryListing = components['schemas']['CategoryListing']
export type ProductCard = components['schemas']['ProductCard']
export type ProductsByCategoryListing = components['schemas']['ProductsByCategoryListing']
}

export type Responses = {
    AllProductsListing: AllProductsListing
    CategoryCard: CategoryCard
    CategoryListing: CategoryListing
    ProductCard: ProductCard
    ProductsByCategoryListing: ProductsByCategoryListing
}

export type ListingQueryFilters = {
    AllProductsListing: components['schemas']['AllProductsListingQueryOptions']['filter']
    CategoryListing: components['schemas']['CategoryListingQueryOptions']['filter']
    ProductsByCategoryListing: components['schemas']['ProductsByCategoryListingQueryOptions']['filter']
}

export type ListingQuerySorts = {
    AllProductsListing: components['schemas']['AllProductsListingQueryOptions']['sort']
    CategoryListing: components['schemas']['CategoryListingQueryOptions']['sort']
    ProductsByCategoryListing: components['schemas']['ProductsByCategoryListingQueryOptions']['sort']
}

type FetchMode = {
    AllProductsListing: 'query';
    CategoryCard: 'key';
    CategoryListing: 'query';
    ProductCard: 'key';
    ProductsByCategoryListing: 'query';
}

declare global {
    export type Page = components['schemas']['Page']
    export type PageRoute = components["schemas"]["PageRoute"];
    export type RouteMeta = components["schemas"]["RouteMeta"];
    export type AlternateRoute = components["schemas"]["AlternateRoute"];
}

declare global {
    export type Pagination = components["schemas"]["_page"];
    export type FilterData = components["schemas"]["_filter"];
    export type FilterGroup = components["schemas"]["_filter"][string];
    export type Filter = components["schemas"]["_filter"][string][number];
    export type SortingGroup = components["schemas"]["_sort"];
    export type Sorting = components["schemas"]["_sort"][number];
    export type AggregationData = components["schemas"]["_aggregation"];
    export type AggregationGroup = components["schemas"]["_aggregation"][string];
    export type Aggregation = components["schemas"]["_aggregation"][string]["total"];
}

declare global {
    export type Media = components['schemas']['Media']
    export type Price = components['schemas']['Price']
    export type Seo = components['schemas']['Seo']
    export type Vendor = components['schemas']['Vendor']
    export type Weight = components['schemas']['Weight']
    export type Option = components['schemas']['Option']
    export type Swatch = components['schemas']['Swatch']
    export type PriceScale = components['schemas']['PriceScale']
    export type Sorting = components['schemas']['Sorting']
    export type Availability = components['schemas']['Availability']
    export type StockLevel = components['schemas']['StockLevel']
}

declare global {
    export type ContextToken = string

    export type Context = {
        /**
        * The region of the context - e.g. 'uk'
        */
        region: string
        /**
        * The locale of the context - e.g. 'en-gb'
        */
        locale: string
        /**
        * The scope of the context - e.g. 'b2c'
        */
        scope: string
        /**
        * The identifier of the context
        */
        token: ContextToken
    }

    export type ContextOption = {
        /**
        * The region of the context - e.g. 'uk'
        */
        region: string
        /**
        * The currency of the context - e.g. 'GBP'
        */
        currency: string
        /**
        * List of locales of the context
        */
        locales: Array<Locale>
    }

    export type Locale = {
        /**
        * The key of the locale - e.g. 'en-GB'
        */
        key: string
        /**
        * The URL configured for the locale - e.g. 'https://demo-shop.com/uk/en'
        */
        url: string
    }
} 