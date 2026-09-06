# syntax=docker/dockerfile:1

FROM node:24-alpine AS ui

WORKDIR /build

RUN corepack enable

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY tsconfig*.json vite-env.d.ts ./
COPY ui ui
RUN pnpm run build

FROM rust:1-alpine AS chef

RUN apk add --no-cache musl-dev build-base perl
RUN cargo install cargo-chef --locked

WORKDIR /build

FROM chef AS planner

COPY . .
RUN cargo chef prepare --recipe-path recipe.json

FROM chef AS builder

COPY --from=planner /build/recipe.json recipe.json
RUN cargo chef cook --release --recipe-path recipe.json

COPY . .
COPY --from=ui /build/ui/dist ui/dist
RUN cargo build --release \
    && cp target/release/blend /build/blend

FROM gcr.io/distroless/static-debian12

LABEL org.opencontainers.image.source="https://github.com/zaknesler/blend"

COPY --from=builder /build/blend /usr/local/bin/blend

ENV BLEND_HOME=/data
VOLUME ["/data"]

EXPOSE 4000

ENTRYPOINT ["/usr/local/bin/blend"]
CMD ["start"]
