# Zephyr's Lab — local build & verify helpers.
#
# Common workflows:
#   make install   first-time setup (npm ci)
#   make dev       live preview while writing (http://localhost:4321)
#   make verify    full local pre-flight: build + search index (what CI runs)
#   make preview   serve the built site locally
#   make clean     remove build artifacts
#
# Node >= 22.12.0 is required (see package.json engines).

NODE := node
NPM  := npm

.PHONY: help install dev build preview verify search-index clean

help: ## Show this help.
	@awk 'BEGIN {FS = ":.*##"} /^[a-zA-Z_-]+:.*##/ {printf "  %-16s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

install: ## Install dependencies (npm ci for reproducible installs).
	$(NPM) ci

dev: ## Start the local dev server with live reload.
	$(NPM) run dev

build: ## Production build into ./dist.
	$(NPM) run build

search-index: build ## Generate the Pagefind search index into ./dist.
	npx pagefind --site dist

# `verify` mirrors what the GitHub Actions deploy workflow does, so a green
# local run means CI will build cleanly too. Runs search-index (which depends
# on build), so the full pipeline executes in order.
verify: search-index ## Full local pre-flight: build + search index (matches CI).
	@echo "verify OK: build + pagefind passed locally"

preview: build ## Serve the built site locally and open it in a browser.
	$(NPM) run preview -- --open

clean: ## Remove build artifacts (dist/, .astro/).
	rm -rf dist .astro
