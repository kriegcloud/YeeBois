### Introduction

I'm developing a web application using a stack comprising TypeScript, Next.js, Drizzle-ORM, tRPC, @tanstack/react-query, @tanstack/react-table, and Zod. These tools offer a range of functionalities, from client-side data manipulation to server-side rendering, and type safety in database interactions.

### Current Implementation

- **Next.js**: Used for SSR & SSG, providing a smooth developer experience with module bundling optimizations.
- **Drizzle-ORM**: Enables type-safe database queries for MySQL.
- **@tanstack/react-table**: Manages client-side sorting, filtering, and data aggregation.
- **@tanstack/react-query**: Handles asynchronous state management and caching.
- **tRPC**: Integrates seamlessly with @tanstack/react-query for end-to-end type safety.
- **Zod**: Used for runtime data validation and type inference.

I've successfully implemented a setup where I can define tables, create queries, and set up TRPC endpoints for data fetching. The data is then rendered using @tanstack/react-table with MUI in Next.js.

### Challenges

I'm struggling with enhancing the application's dynamism, specifically in implementing features like offset pagination, URL state syncing, and more complex querying capabilities like filtering and sorting. While I've developed a custom hook `useQueryState` for URL state syncing, the process of extending my queries to support additional features like sorting and filtering while maintaining URL sync is complex.

### My Code  and Thoughts on the matter

Let's Say I have the following MySQL table defined in drizzle-orm
```
import { relations } from "drizzle-orm";
import { mysqlTable, primaryKey, timestamp, varchar } from "drizzle-orm/mysql-core";
import { tenants } from "../../tenant/t_tenant/table";

//---------------------------------
// Table Definition
//---------------------------------
export const events = mysqlTable(
  "t_event",
  {
    createdOn: timestamp("created_on").notNull().defaultNow(),
    modifiedOn: timestamp("modified_on").onUpdateNow(),
    eventId: varchar("event_id", { length: 50 }).notNull(),
    eventStart: timestamp("event_start").notNull(),
    eventEnd: timestamp("event_end"),
    comment: varchar("comment", { length: 250 }),
    tenantId: varchar("tenant_id", { length: 50 }).notNull()
  },
  (t) => ({
    pk: primaryKey({ name: "t_event", columns: [t.eventId, t.tenantId] })
  })
);
//---------------------------------
// Table Relations
//---------------------------------
export const eventRelations = relations(events, ({ one }) => ({
  tenant: one(tenants, {
    fields: [events.tenantId],
    references: [tenants.tenantId]
  })
}));

```

Additionally Here is an example query for this table:
```
import { db } from "../../../index";
import { events } from "./table";

export const getEvents = db
  .select({
    eventId: events.eventId,
    eventStart: events.eventStart,
    eventEnd: events.eventEnd,
    comment: events.comment,
  })
  .from(events)
  .prepare();
```

And here is a trpc endpoint that uses this query which will exist at this path `rocketInventory.setup.events.view`:
```
import { TRPCError } from "@trpc/server";  
import { getEvents } from "@e2/db/schema/inventory/t_event/queries";  
import { createTRPCRouter, tenantScopedProcedure } from "../../../trpc";  
  
export const eventsRouter = createTRPCRouter({  
  view: tenantScopedProcedure.query(async ({ ctx }) => {  
  
    const result = await getEvents.execute({ tenantId });  
  
    if (!result) {  
      throw new TRPCError({  
        code: "NOT_FOUND",  
        message: "No events found",  
      });  
    }  
  
    return result;  
  }),  
});
```

And Finally here is a NextJS page that calls this endpoint and renders it in a @tanstack/react-table using MUI.

```
import { api, type RouterOutputs } from "~/utils/api";  
import type { NextPage } from "next"inffering;  
import Box from "@mui/material/Box";  
import { useMemo } from "react";  
  
// Just an extension of @tanstack/react-table with Material UI  
import {  
  useMaterialReactTable,  
  MaterialReactTable,  
  type MRT_ColumnDef  
} from "material-react-table";  
  
  
type Event = RouterOutputs["rocketInventory"]["setup"]["events"]["view"]["output"]["data"][number];  
  
const EventsSetupPage: NextPage = () => {  
  const { data, isLoading, isError, isFetching, error } = api.rocketInventory.setup.events.view.useQuery();  
  
  const columns = useMemo<MRT_ColumnDef<Event>[]>(() => [  
    {      label: "Event ID",  
      accessorKey: "eventId"  
    },  
    {      label: "Event Start",  
      accessorKey: "eventStart"  
      Cell: ({ cell }) => cell.getValue<Date>().toLocaleDateString()  
    },    {  
      label: "Event End",  
      accessorKey: "eventEnd",  
      Cell: ({ cell }) => cell.getValue<Date>().toLocaleDateString()  
    },    {      label: "Comment",  
      accessorKey: "comment"  
    }  
  ], []);  
  const table = useMaterialReactTable({  
    columns,  
    data: data ?? [],  
    state: {  
      isLoading,  
      showAlertBanner: isError,  
      showProgressBars: isFetching  
    }  
  });  
  
  if (isLoading || isFetching) {  
    return <Box>Loading...</Box>;  
  }  
  if (isError) {  
    return <Box>Error: {error.message}</Box>;  
  }  
  return (  
    <MaterialReactTable table={table} />  
  );  
};  
  
export default EventsSetupPage;
```

All of this works great. From defining the table, creating the query, creating the trpc endpoint and calling it is relatively easy. However, The second I want to make this process a little more dynamic I am struggling to come up with a good solution.

For example let's say I want to use offset pagination on this query, sync the state of the users current page to a URL query-param without having to rewrite my original getEvents query. To do this Drizzle ORM offer a pretty nice solution call "dynamic query building". Take for example the following code.
```
const withPagination = <T extends MySqlSelect>(  
  qb: T,  
  page: number,  
  pageSize = 10,  
) => {  
  return qb.limit(pageSize).offset(page * pageSize);  
};
```

Using this `withPagination` dynamic query I can paginate the results of `getEvents`.
```
import { db } from "../../../index";
import { events } from "./table";
import { withPagination } from "../../query-builders";

const allEvents = db
  .select({
    eventId: events.eventId,
    eventStart: events.eventStart,
    eventEnd: events.eventEnd,
    comment: events.comment,
  })
  .from(events)
  .groupBy(events.eventId, events.eventStart, events.eventEnd, events.comment)
  .$dynamic();

const allEventsCount = db
  .select({
    count: count(),
  })
  .from(events)
  .prepare();

interface PaginatedEventsParams {
  pageIndex: number;
  pageSize: number;
}

export const paginatedEventsQuery = async ({
  pageIndex,
  pageSize,
}: PaginatedEventsParams) => {
  const totalRecords = await allEventsCount
    .execute()
    .then((res) => res[0]?.count);
  if (!totalRecords) return;
  const result = await withPagination(allEvents, pageIndex, pageSize);

  return {
    data: result,
    meta: {
      totalRowCount: totalRecords,
      totalPages: Math.ceil(totalRecords / pageSize),
    },
  };
};

```

Perfect now I can paginate events but how can I sync the page the user is on in the client with the state of the URL in NextJS.

Not very easily however I created custom react hook called `useQueryState` In order to accomplish this and It works swimmingly:
```
import React from "react";
import { useRouter, useSearchParams } from "next/navigation.js"; // https://github.com/47ng/next-usequerystate/discussions/352

import type { Parser } from "./parsers";
import { emitter, SYNC_EVENT_KEY } from "./sync";
import type { Options } from "./types";
import {
  enqueueQueryStringUpdate,
  flushToURL,
  getInitialStateFromQueue,
} from "./update-queue";

export interface UseQueryStateOptions<T> extends Parser<T>, Options {}

export type UseQueryStateReturn<Parsed, Default> = [
  Default extends undefined ? Parsed | null : Parsed,
  (
    value: null | Parsed | ((old: Default extends Parsed ? Parsed : Parsed | null) => Parsed | null),
    options?: Options,
  ) => Promise<URLSearchParams>,
];

// Overload type signatures ----------------------------------------------------
// Note: the order of declaration matters (from the most specific to the least).

/**
 * React state hook synchronized with a URL query string in Next.js
 * 
 * This variant is used when providing a default value. This will make
 * the returned state non-nullable when the query is not present in the URL.
 * (the default value will be returned instead).
 * 
 * _Note: the URL will **not** be updated with the default value if the query
 * is missing._
 * 
 * Setting the value to `null` will clear the query in the URL, and return
 * the default value as state.
 * 
 * Example usage:
 * ```ts
 * const [count, setCount] = useQueryState(
 *   'count',
 *   queryTypes.integer.defaultValue(0)
 * )
 * 
 * const increment = () => setCount(oldCount => oldCount + 1)
 * const decrement = () => setCount(oldCount => oldCount - 1)
 * // Clears the query key from the URL and `count` equals 0
 * const clearCountQuery = () => setCount(null)
 * ```
 * @param key The URL query string key to bind to
 * @param options - Parser (defines the state data type), default value and optional history mode.
 */
export function useQueryState<T>(
  key: string,
  options: UseQueryStateOptions<T> & { defaultValue: T },
): UseQueryStateReturn<
  NonNullable<ReturnType<typeof options.parse>>,
  typeof options.defaultValue
>;

/**
 * React state hook synchronized with a URL query string in Next.js
 * 
 * If the query is missing in the URL, the state will be `null`.
 * 
 * Example usage:
 * ```ts
 * // Blog posts filtering by tag
 * const [tag, selectTag] = useQueryState('tag')
 * const filteredPosts = posts.filter(post => tag ? post.tag === tag : true)
 * const clearTag = () => selectTag(null)
 * ```
 * @param key The URL query string key to bind to
 * @param options - Parser (defines the state data type), and optional history mode.
 */
export function useQueryState<T>(
  key: string,
  options: UseQueryStateOptions<T>,
): UseQueryStateReturn<
  NonNullable<ReturnType<typeof options.parse>>,
  undefined
>;

/**
 * Default type string, limited options & default value
 */
export function useQueryState(
  key: string,
  options: Options & {
    defaultValue: string;
  },
): UseQueryStateReturn<string, typeof options.defaultValue>;

/**
 * React state hook synchronized with a URL query string in Next.js
 * 
 * If the query is missing in the URL, the state will be `null`.
 * 
 * Note: by default the state type is a `string`. To use different types-old.ts,
 * check out the `queryTypes` helpers:
 * ```ts
 * const [date, setDate] = useQueryState(
 *   'date',
 *   queryTypes.isoDateTime.withDefault(new Date('2021-01-01'))
 * )
 * 
 * const setToNow = () => setDate(new Date())
 * const addOneHour = () => {
 *   setDate(oldDate => new Date(oldDate.valueOf() + 3600_000))
 * }
 * ```
 * @param key The URL query string key to bind to
 * @param options - Parser (defines the state data type), and optional history mode.
 */
export function useQueryState(
  key: string,
  options: Pick<UseQueryStateOptions<string>, keyof Options>,
): UseQueryStateReturn<string, undefined>;

/**
 * React state hook synchronized with a URL query string in Next.js
 * 
 * If used without a `defaultValue` supplied in the options, and the query is
 * missing in the URL, the state will be `null`.
 * 
 * ### Behaviour with default values:
 * 
 * _Note: the URL will **not** be updated with the default value if the query
 * is missing._
 * 
 * Setting the value to `null` will clear the query in the URL, and return
 * the default value as state.
 * 
 * Example usage:
 * ```ts
 * // Blog posts filtering by tag
 * const [tag, selectTag] = useQueryState('tag')
 * const filteredPosts = posts.filter(post => tag ? post.tag === tag : true)
 * const clearTag = () => selectTag(null)
 * 
 * // With default values
 * 
 * const [count, setCount] = useQueryState(
 *   'count',
 *   queryTypes.integer.defaultValue(0)
 * )
 * 
 * const increment = () => setCount(oldCount => oldCount + 1)
 * const decrement = () => setCount(oldCount => oldCount - 1)
 * const clearCountQuery = () => setCount(null)
 * 
 * // --
 * 
 * const [date, setDate] = useQueryState(
 *   'date',
 *   queryTypes.isoDateTime.withDefault(new Date('2021-01-01'))
 * )
 * 
 * const setToNow = () => setDate(new Date())
 * const addOneHour = () => {
 *   setDate(oldDate => new Date(oldDate.valueOf() + 3600_000))
 * }
 * ```
 * @param key The URL query string key to bind to
 * @param options - Parser (defines the state data type), optional default value and history mode.
 */
export function useQueryState<T = string>(
  key: string,
  {
    history = "replace",
    shallow = true,
    scroll = false,
    parse = (x) => x as unknown as T,
    serialize = String,
    defaultValue = undefined,
  }: Partial<UseQueryStateOptions<T>> & { defaultValue?: T } = {
    history: "replace",
    shallow: true,
    scroll: false,
    parse: (x) => x as unknown as T,
    serialize: String,
    defaultValue: undefined,
  },
) {
  const router = useRouter();
  // Not reactive, but available on the server and on page load
  const initialSearchParams = useSearchParams();
  const [internalState, setInternalState] = React.useState<T | null>(() => {
    const queueValue = getInitialStateFromQueue(key);
    const urlValue =
      typeof window !== "object"
        ? // SSR
          initialSearchParams?.get(key) ?? null
        : // Components mounted after page load must use the current URL value
          new URLSearchParams(window.location.search).get(key) ?? null;
    const value = queueValue ?? urlValue;
    return value === null ? null : parse(value);
  });
  const stateRef = React.useRef(internalState);

  // Sync all hooks together & with external URL changes
  React.useInsertionEffect(() => {
    function updateInternalState(state: T | null) {
      stateRef.current = state;
      setInternalState(state);
    }
    function syncFromURL(search: URLSearchParams) {
      const value = search.get(key) ?? null;
      const state = value === null ? null : parse(value);
      updateInternalState(state);
    }

    emitter.on(SYNC_EVENT_KEY, syncFromURL);
    emitter.on(key, updateInternalState);
    return () => {
      emitter.off(SYNC_EVENT_KEY, syncFromURL);
      emitter.off(key, updateInternalState);
    };
  }, [key]);

  const update = React.useCallback(
    (stateUpdater: React.SetStateAction<T | null>, options: Options = {}) => {
      const newValue: T | null = isUpdaterFunction(stateUpdater)
        ? stateUpdater(stateRef.current ?? defaultValue ?? null)
        : stateUpdater;

      // Sync all hooks state (including this one)
      emitter.emit(key, newValue);
      enqueueQueryStringUpdate(key, newValue, serialize, {
        // Call-level options take precedence over hook declaration options.
        history: options.history ?? history,
        shallow: options.shallow ?? shallow,
        scroll: options.scroll ?? scroll,
      });
      return flushToURL(router);
    },
    [
      key,
      history,
      shallow,
      scroll,
      // internalState, defaultValue
    ],
  );
  return [internalState ?? defaultValue ?? null, update];
}

function isUpdaterFunction<T>(
  stateUpdater: React.SetStateAction<T>,
): stateUpdater is (prevState: T) => T {
  return typeof stateUpdater === "function";
}

```

If you need clarification on how this works to answer the question I am about to ask you please feel free to ask. However that fact I got this to work isn't going to help as It is working perfectly and at least knocks out one of the pieces to this puzzle. Here is an example of it's usage in our NextJS page and TRPC endpoint.

Our api endpoint now becomes:
```
import { TRPCError } from "@trpc/server";  
import { getEvents } from "@e2/db/schema/inventory/t_event/queries";  
import { createTRPCRouter, tenantScopedProcedure } from "../../../trpc";  
import { z } from "zod";

export const eventsViewSchema = z.object({  
  pageIndex: z.number().nullish(),  
  pageSize: z.number().nullish(),  
});  
  
export const eventsRouter = createTRPCRouter({  
  view: tenantScopedProcedure  
  .input(eventsViewSchema)  
  .query(async ({ ctx, input }) => {  
    const result = await paginatedEventsQuery({  
      pageIndex: input.pageIndex ?? 0,  
      pageSize: input.pageSize ?? 10,  
    });  
  
    if (!result) {  
      throw new TRPCError({  
        code: "NOT_FOUND",  
        message: "No events found",  
      });  
    }  
  
    return result;  
  }),
});
```

And Our frontend NextJS page code now becomes:

```
import { useMemo } from "react";
import type { NextPage } from "next";
import Box from "@mui/material/Box";
// Just an extension of @tanstack/react-table with Material UI
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";

import { parseAsInteger, useQueryState } from "@e2/lib";
import { api, type RouterOutputs } from "~/utils/api";

type Event =
  RouterOutputs["rocketInventory"]["setup"]["events"]["view"][number]["data"];

const EventsSetupPage: NextPage = () => {
  const [pageIndex, setPageIndex] = useQueryState(
    "pageIndex",
    parseAsInteger.withDefault(0),
  );
  const [pageSize, setPageSize] = useQueryState(
    "pageSize",
    parseAsInteger.withDefault(10),
  );

  const { data, isLoading, isError, isFetching, error } =
    api.rocketInventory.setup.events.view.useQuery({
      pageIndex,
      pageSize,
    });

  const columns = useMemo<MRT_ColumnDef<Event>[]>(
    () => [
      {
        header: "Event ID",
        accessorKey: "eventId",
      },
      {
        header: "Event Start",
        accessorKey: "eventStart",
        Cell: ({ cell }) => cell.getValue<Date>().toLocaleDateString(),
      },
      {
        header: "Event End",
        accessorKey: "eventEnd",
        Cell: ({ cell }) => cell.getValue<Date>().toLocaleDateString(),
      },
      {
        header: "Comment",
        accessorKey: "comment",
      },
    ],
    [],
  );

  const table = useMaterialReactTable({
    columns,
    data: data?.data ?? [],
    state: {
      isLoading,
      showAlertBanner: isError,
      showProgressBars: isFetching,
      pagination: {
        pageIndex,
        pageSize,
      },
      pageCount: data?.meta.totalPages ?? 0,
      totalRowCount: data?.meta.totalRowCount ?? 0,
    },
  });

  if (isLoading || isFetching) {
    return <Box>Loading...</Box>;
  }
  if (isError) {
    return <Box>Error: {error.message}</Box>;
  }
  return <MaterialReactTable table={table} />;
};

export default EventsSetupPage;

```

All of that work just to get a paginated query that works with @tanstack/react-table. Well now what If I want to filter by other columns or find events between the `startDate` and `endDate` column what if I want to sort and have all of this synced to the URL and without having to write out all of this boiler plate to get my queries to support sort, pagination, filter, aggregate etc.

### What I want to build
- 








