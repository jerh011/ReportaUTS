// // src/services/httpService.ts
// export const X_SKIP_INTERCEPTOR = "X-Skip-Interceptor";

// export type ParamsObj = Record<string, string | number | boolean>;
// export type HeadersObj = Record<string, string>;

// export type HttpOptions = {
//   headers?: HeadersObj;
//   params?: ParamsObj;
//   body?: any;
//   responseType?: "json" | "blob" | "text";
//   skipInterceptor?: boolean;
// };

// function buildUrl(base: string, endpoint: string, params?: ParamsObj) {
//   const e = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
//   // normalizar base
//   const b = base.endsWith("/") ? base.slice(0, -1) : base;
//   const url = new URL(b + e, window.location.origin);
//   if (params) {
//     Object.entries(params).forEach(([k, v]) => {
//       if (v === undefined || v === null) return;
//       url.searchParams.append(k, String(v));
//     });
//   }
//   return url.toString();
// }

// function normalizeHeaders(h?: HeadersObj, skipInterceptor?: boolean): Headers {
//   const headers = new Headers(h ?? {});
//   if (skipInterceptor) headers.set(X_SKIP_INTERCEPTOR, "true");
//   return headers;
// }

// export class HttpService {
//   private baseUrl: string;

//   constructor(baseUrl?: string) {
//     const raw = baseUrl ?? (import.meta.env.VITE_API_URL as string) ?? "";
//     this.baseUrl = raw.endsWith("/") ? raw : raw + "/";
//   }

//   private async request<T>(
//     method: string,
//     endpoint: string,
//     options?: HttpOptions
//   ): Promise<T> {
//     const url = buildUrl(this.baseUrl, endpoint, options?.params);
//     const headers = normalizeHeaders(
//       options?.headers,
//       options?.skipInterceptor
//     );

//     const fetchOptions: RequestInit = { method, headers };

//     if (options?.body !== undefined) {
//       if (
//         !(options.body instanceof FormData) &&
//         !(options.body instanceof Blob)
//       ) {
//         if (!headers.has("Content-Type"))
//           headers.set("Content-Type", "application/json");
//         fetchOptions.body = JSON.stringify(options.body);
//       } else {
//         fetchOptions.body = options.body;
//       }
//     }

//     const resp = await fetch(url, fetchOptions);

//     if (!resp.ok) {
//       let errBody: any = null;
//       try {
//         errBody = await resp.json();
//       } catch {
//         try {
//           errBody = await resp.text();
//         } catch {}
//       }
//       const message =
//         errBody?.message ?? errBody ?? `HTTP ${resp.status} ${resp.statusText}`;
//       const err = new Error(String(message));
//       (err as any).status = resp.status;
//       (err as any).body = errBody;
//       throw err;
//     }

//     const rType = options?.responseType ?? "json";
//     if (rType === "json") return (await resp.json()) as T;
//     if (rType === "blob") return (await resp.blob()) as unknown as T;
//     return (await resp.text()) as unknown as T;
//   }

//   get<T = any>(
//     endpoint: string,
//     options?: Omit<HttpOptions, "body">
//   ): Promise<T> {
//     return this.request<T>("GET", endpoint, options);
//   }

//   post<T = any>(
//     endpoint: string,
//     body?: any,
//     options?: Omit<HttpOptions, "body">
//   ): Promise<T> {
//     return this.request<T>("POST", endpoint, { ...(options ?? {}), body });
//   }

//   put<T = any>(
//     endpoint: string,
//     body?: any,
//     options?: Omit<HttpOptions, "body">
//   ): Promise<T> {
//     return this.request<T>("PUT", endpoint, { ...(options ?? {}), body });
//   }

//   patch<T = any>(
//     endpoint: string,
//     body?: any,
//     options?: Omit<HttpOptions, "body">
//   ): Promise<T> {
//     return this.request<T>("PATCH", endpoint, { ...(options ?? {}), body });
//   }

//   delete<T = any>(
//     endpoint: string,
//     options?: Omit<HttpOptions, "body">
//   ): Promise<T> {
//     return this.request<T>("DELETE", endpoint, options);
//   }

//   getBlob(
//     endpoint: string,
//     options?: Omit<HttpOptions, "body" | "responseType">
//   ): Promise<Blob> {
//     return this.request<Blob>("GET", endpoint, {
//       ...(options ?? {}),
//       responseType: "blob",
//     });
//   }
// }

// const http = new HttpService();
// export default http;
