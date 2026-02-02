export interface paths {
    "/listing/allproductslisting": {
        parameters: {
            query?: never;
            header?: {
                /** @description The Frontend URL that is requesting the resource. Can be used to map view block requests to specific pages and get advanced insight into frontend behavior. */
                "fs-request-url"?: components["parameters"]["FsRequestUrl"];
            };
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Fetch AllProductsListing
         * @description Fetch AllProductsListing
         */
        post: operations["getAllProductsListingBlock"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/block/categorycard/{key}": {
        parameters: {
            query?: never;
            header?: {
                /** @description The Frontend URL that is requesting the resource. Can be used to map view block requests to specific pages and get advanced insight into frontend behavior. */
                "fs-request-url"?: components["parameters"]["FsRequestUrl"];
            };
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Fetch CategoryCard
         * @description Fetch CategoryCard
         */
        post: operations["getCategoryCardBlock"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/listing/categorylisting": {
        parameters: {
            query?: never;
            header?: {
                /** @description The Frontend URL that is requesting the resource. Can be used to map view block requests to specific pages and get advanced insight into frontend behavior. */
                "fs-request-url"?: components["parameters"]["FsRequestUrl"];
            };
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Fetch CategoryListing
         * @description Fetch CategoryListing
         */
        post: operations["getCategoryListingBlock"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/block/productcard/{key}": {
        parameters: {
            query?: never;
            header?: {
                /** @description The Frontend URL that is requesting the resource. Can be used to map view block requests to specific pages and get advanced insight into frontend behavior. */
                "fs-request-url"?: components["parameters"]["FsRequestUrl"];
            };
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Fetch ProductCard
         * @description Fetch ProductCard
         */
        post: operations["getProductCardBlock"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/listing/productsbycategorylisting": {
        parameters: {
            query?: never;
            header?: {
                /** @description The Frontend URL that is requesting the resource. Can be used to map view block requests to specific pages and get advanced insight into frontend behavior. */
                "fs-request-url"?: components["parameters"]["FsRequestUrl"];
            };
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Fetch ProductsByCategoryListing
         * @description Fetch ProductsByCategoryListing
         */
        post: operations["getProductsByCategoryListingBlock"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        String: string;
        Integer: number;
        Float: number;
        Boolean: boolean;
        DateTime: string;
        Any: Record<string, never>;
        Media: {
            key?: components["schemas"]["String"];
            src?: components["schemas"]["String"];
            mimeType?: components["schemas"]["String"];
            altText?: components["schemas"]["String"];
            thumbnailSrc?: components["schemas"]["String"];
            type?: components["schemas"]["String"];
            position?: components["schemas"]["Integer"];
        };
        Price: {
            precision?: components["schemas"]["Integer"];
            currency?: components["schemas"]["String"];
            scales?: components["schemas"]["PriceScale"][];
            amount?: components["schemas"]["Integer"];
            ref?: components["schemas"]["Integer"];
        };
        Seo: {
            title?: components["schemas"]["String"];
            description?: components["schemas"]["String"];
            keywords?: components["schemas"]["String"][];
        };
        Vendor: {
            key?: components["schemas"]["String"];
            label?: components["schemas"]["String"];
            image?: components["schemas"]["Media"];
        };
        Weight: {
            value?: components["schemas"]["Float"];
            unit?: components["schemas"]["String"];
        };
        Option: {
            attribute?: components["schemas"]["String"];
            label?: components["schemas"]["String"];
            value?: components["schemas"]["String"];
        };
        Swatch: {
            label?: components["schemas"]["String"];
            image?: components["schemas"]["Media"];
            color?: components["schemas"]["String"];
        };
        /** @enum {string} */
        Availability: "in-stock" | "out-of-stock" | "preorder" | "backorder";
        /** @enum {string} */
        StockLevel: "low" | "medium" | "high";
        PriceScale: {
            from?: components["schemas"]["Integer"];
            amount?: components["schemas"]["Integer"];
        };
        Sorting: {
            key?: components["schemas"]["String"];
            position?: components["schemas"]["Integer"];
        };
        _page: {
            /** @description The number of items per page */
            limit: number;
            /** @description The current page */
            current: number;
            /** @description The next page */
            next: number;
            /** @description The previous page */
            prev: number;
            /** @description The last page */
            last: number;
        };
        _filter: {
            [key: string]: {
                /** @description The facet option name */
                option: string;
                /** @description The facet option value */
                value: string;
                /** @description The number of items with this facet option */
                count: number;
                /** @description Indicates if the facet option is selected */
                selected?: boolean;
                /** @description Indicates if the filter facet is disabled */
                disabled?: boolean;
            }[];
        };
        _aggregation: {
            [key: string]: {
                total: {
                    /** @description The maximum value for this field */
                    max?: number;
                    /** @description The minimum value for this field */
                    min?: number;
                    /** @description The aggregated average for this field */
                    avg?: number;
                    /** @description The aggregated sum for this field */
                    sum?: number;
                    /** @description The total number of possible values for this field */
                    total: number;
                };
                result: {
                    /** @description The maximum value for this field */
                    max?: number;
                    /** @description The minimum value for this field */
                    min?: number;
                    /** @description The aggregated average for this field */
                    avg?: number;
                    /** @description The aggregated sum for this field */
                    sum?: number;
                    /** @description The total number of possible values for this field */
                    total: number;
                };
            };
        };
        _sort: {
            /** @description The sorting field name */
            field: string;
            /** @description The sort directions for this field */
            orders: ("asc" | "desc")[];
        }[];
        /** @description The total number of items */
        _total: number;
        /** @description Filter results by a set of conditions */
        _searchQueryFilter: {
            /**
             * @description The type of the filter
             * @enum {string}
             */
            type: "equals" | "range" | "contains" | "and" | "or" | "not";
            /** @description The field to filter on */
            field?: string;
            /** @description If the filter has a value (equals, contains), the value to filter by */
            value?: string;
            /** @description If the filter has a range, the start of the range */
            from?: number;
            /** @description If the filter has a range, the end of the range */
            to?: number;
            /** @description If the filter is a composition (and, or, not), the filters to apply */
            filter?: components["schemas"]["_searchQueryFilter"][];
        }[];
        _searchQuerySort: {
            /** @description The field to sort by */
            field: string;
            /**
             * @description The sort direction
             * @enum {string}
             */
            order: "asc" | "desc";
        };
        _searchQueryOptions: {
            filter: components["schemas"]["_searchQueryFilter"];
            sort: components["schemas"]["_searchQuerySort"] | components["schemas"]["_searchQuerySort"][] | string;
            /** @description Limit the number of results returned */
            limit?: number;
            /** @description Paginate results */
            page?: number;
            /** @description Will search fields that are marked as searchable */
            search?: string;
        };
        AllProductsListing: {
            items?: components["schemas"]["ProductCard"][];
            filter?: components["schemas"]["_filter"];
            aggregation?: components["schemas"]["_aggregation"];
            sort?: components["schemas"]["_sort"];
            page?: components["schemas"]["_page"];
            total?: components["schemas"]["_total"];
        };
        CategoryCard: {
            breadcrumb?: components["schemas"]["String"][];
            cover?: components["schemas"]["Media"];
            key: components["schemas"]["String"];
            level?: components["schemas"]["Integer"];
            slug?: components["schemas"]["String"];
            title?: components["schemas"]["String"];
        };
        CategoryListing: {
            items?: components["schemas"]["CategoryCard"][];
            filter?: components["schemas"]["_filter"];
            aggregation?: components["schemas"]["_aggregation"];
            sort?: components["schemas"]["_sort"];
            page?: components["schemas"]["_page"];
            total?: components["schemas"]["_total"];
        };
        ProductCard: {
            categoryIds?: components["schemas"]["String"][];
            cover?: components["schemas"]["Media"];
            description?: components["schemas"]["String"];
            id?: components["schemas"]["String"];
            key: components["schemas"]["String"];
            name?: components["schemas"]["String"];
            price?: components["schemas"]["Price"];
            productNumber?: components["schemas"]["String"];
        };
        ProductsByCategoryListing: {
            items?: components["schemas"]["ProductCard"][];
            filter?: components["schemas"]["_filter"];
            aggregation?: components["schemas"]["_aggregation"];
            sort?: components["schemas"]["_sort"];
            page?: components["schemas"]["_page"];
            total?: components["schemas"]["_total"];
        };
        /** @description Available query options (filters and sortings) for AllProductsListing blocks */
        AllProductsListingQueryOptions: {
            /** @description Sort options for AllProductsListing blocks */
            sort: Record<string, never>;
            /** @description Filter options for AllProductsListing blocks */
            filter: Record<string, never>;
        };
        /** @description Available query options (filters and sortings) for CategoryListing blocks */
        CategoryListingQueryOptions: {
            /** @description Sort options for CategoryListing blocks */
            sort: Record<string, never>;
            /** @description Filter options for CategoryListing blocks */
            filter: Record<string, never>;
        };
        /** @description Available query options (filters and sortings) for ProductsByCategoryListing blocks */
        ProductsByCategoryListingQueryOptions: {
            /** @description Sort options for ProductsByCategoryListing blocks */
            sort: Record<string, never>;
            /** @description Filter options for ProductsByCategoryListing blocks */
            filter: Record<string, never>;
        };
        Page: components["schemas"]["EmptyPage"];
        EmptyPage: {
            route: components["schemas"]["RouteMeta"];
        };
        PageRoute: {
            href: string;
            path: string;
            slug: string;
            url: string;
        };
        /** @description Used to  tell Google about localized versions of your page */
        AlternateRoute: components["schemas"]["PageRoute"] & {
            /** @description Optional lang code targeted by this version of the page - e.g. 'en' or 'en-us' */
            lang?: string;
            /** @description Locale code from domain settings for this alternate route */
            locale: string;
            /** @description Region code from domain settings for this alternate route */
            region: string;
        };
        RouteMeta: {
            /**
             * @description Defines the route status by using an http status code
             * @enum {integer}
             */
            code: 200 | 301 | 404;
            /** @description Optional redirect to follow when the route is not found / outdated */
            redirect?: components["schemas"]["PageRoute"];
            /** @description Information about the context the route belongs to. Includes suggested route to redirect when mismatch. */
            context?: {
                region: string;
                locale: string;
                suggested?: components["schemas"]["AlternateRoute"];
            };
            /** @description Alternate routes for the page, defined by the projects domain settings */
            alternates?: components["schemas"]["AlternateRoute"][];
        };
    };
    responses: never;
    parameters: {
        /** @description Context key that identifies the user session. If the context key is not provided, a new context will be generated and returned in the response header. */
        FsContextKey: string;
        /** @description A token used to access environments other than the public environment. */
        FsVersionToken: "40fd7302-b526-4cc8-a8e2-7d0eaec2baf4";
        /** @description Secret is used to access the fetch API. */
        FsSecret: string;
        /** @description The Frontend URL that is requesting the resource. Can be used to map view block requests to specific pages and get advanced insight into frontend behavior. */
        FsRequestUrl: string;
    };
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    getAllProductsListingBlock: {
        parameters: {
            query?: never;
            header?: {
                /** @description The Frontend URL that is requesting the resource. Can be used to map view block requests to specific pages and get advanced insight into frontend behavior. */
                "fs-request-url"?: components["parameters"]["FsRequestUrl"];
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Found */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AllProductsListing"];
                };
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    getCategoryCardBlock: {
        parameters: {
            query?: never;
            header?: {
                /** @description The Frontend URL that is requesting the resource. Can be used to map view block requests to specific pages and get advanced insight into frontend behavior. */
                "fs-request-url"?: components["parameters"]["FsRequestUrl"];
            };
            path: {
                /** @description Description missing for key */
                key: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Found */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CategoryCard"];
                };
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    getCategoryListingBlock: {
        parameters: {
            query?: never;
            header?: {
                /** @description The Frontend URL that is requesting the resource. Can be used to map view block requests to specific pages and get advanced insight into frontend behavior. */
                "fs-request-url"?: components["parameters"]["FsRequestUrl"];
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Found */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CategoryListing"];
                };
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    getProductCardBlock: {
        parameters: {
            query?: never;
            header?: {
                /** @description The Frontend URL that is requesting the resource. Can be used to map view block requests to specific pages and get advanced insight into frontend behavior. */
                "fs-request-url"?: components["parameters"]["FsRequestUrl"];
            };
            path: {
                /** @description Description missing for key */
                key: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Found */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProductCard"];
                };
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    getProductsByCategoryListingBlock: {
        parameters: {
            query?: never;
            header?: {
                /** @description The Frontend URL that is requesting the resource. Can be used to map view block requests to specific pages and get advanced insight into frontend behavior. */
                "fs-request-url"?: components["parameters"]["FsRequestUrl"];
            };
            path?: never;
            cookie?: never;
        };
        /** @description Description missing for param */
        requestBody: {
            content: {
                "application/json": components["schemas"]["_searchQueryOptions"] & {
                    param?: {
                        /** @description Description missing for categoryId */
                        categoryId: string;
                    };
                };
            };
        };
        responses: {
            /** @description Found */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProductsByCategoryListing"];
                };
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
}
