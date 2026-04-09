# Salable Node SDK

The official Node.js SDK for the [Salable](https://salable.app) API. An easy, type-safe wrapper that makes it simple to manage products, plans, subscriptions, and more.

## Table of Contents

- [Getting Started](#getting-started)
  - [Installation](#installation)
  - [Initialisation](#initialisation)
- [CRUD Pattern](#crud-pattern)
- [Error Handling](#error-handling)
- [Query Parameters](#query-parameters)

---

## Getting Started

### Installation

```bash
npm install @salable/sdk
```

### Initialisation

Create a single `Salable` instance using your API key. All API calls are made through this instance.

```typescript
import { Salable } from '@salable/sdk';

const salable = new Salable('your-api-key');
```

> Your API key is sent as a `Bearer` token on every request. Keep it secure and out of version control.

---

## CRUD Pattern

Every resource follows the same fluent interface pattern:

| Operation | Method | Example |
|-----------|--------|---------|
| List all  | `.get()` | `salable.api.products.get()` |
| Get one   | `.byId(id).get()` | `salable.api.products.byId(id).get()` |
| Create    | `.post(body)` | `salable.api.products.post({ name: '...' })` |
| Update    | `.byId(id).put(body)` | `salable.api.products.byId(id).put({ name: '...' })` |
| Delete    | `.byId(id).delete()` | `salable.api.products.byId(id).delete()` |

---

## Error Handling

All methods throw an `ErrorResponseBody` for non-2xx responses. Wrap calls in a `try/catch` block:

```typescript
try {
  const product = await salable.api.products.byId('product-id').get();
  console.log(product);
} catch (error) {
  console.error('API error:', error);
}
```

Common HTTP status codes returned:

| Status | Meaning |
|--------|---------|
| `400` | Bad request — check your request body |
| `401` | Unauthorised — check your API key |
| `403` | Forbidden — insufficient permissions |
| `404` | Resource not found |
| `429` | Rate limit exceeded |
| `500` | Internal server error |

---

## Query Parameters

Query parameters are passed via the optional `requestConfiguration` argument accepted by every `.get()` call:

```typescript
await salable.api.products.get({
  queryParameters: {
    limit: '20',
    after: 'cursor-from-previous-page',
    before: 'cursor-for-previous-page',
    search: 'keyword',
  },
});
```

Pagination uses cursor-based `after` / `before` values returned in list responses.
