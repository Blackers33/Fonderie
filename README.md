# Fonderie

Fonderie est une application de suivi de musculation, inspirée par des produits comme Hevy.

Ce repository contient mon projet de fin d'etudes, avec une architecture monorepo regroupant:

- une application mobile (React Native + Expo)
- une API backend (NestJS)
- une application web (Next.js)
- des packages partages (utils et configurations TypeScript)

## Vision du projet

L'objectif de Fonderie est d'offrir un outil simple et performant pour suivre sa progression a la salle:

- planifier et enregistrer ses seances
- suivre ses exercices, series, charges et repetitions
- visualiser sa progression dans le temps
- centraliser les donnees d'entrainement entre mobile, API et web

## Stack technique

- Monorepo: pnpm workspaces + Turborepo
- Mobile: Expo, React Native, Expo Router, NativeWind
- API: NestJS, Vitest
- Web: Next.js
- Qualite de code: Biome, ESLint, Husky, lint-staged
- Langage: TypeScript

## Structure du repository

```text
apps/
	api/      # Backend NestJS
	mobile/   # Application mobile Expo/React Native
	web/      # Application web Next.js

packages/
	shared-utils/  # Fonctions partagees entre apps

tsconfig/
	# Presets TypeScript partages
```

## Prerequis

- Node.js >= 20
- pnpm 10+
- (Mobile) Expo Go ou emulateur Android/iOS

## Installation

```bash
pnpm install
```

## Commandes principales

Depuis la racine du projet:

```bash
# Lancer le developpement (API + mobile)
pnpm dev

# Lancer tous les tests du monorepo
pnpm test

# Lancer la verification de style/qualite
pnpm lint

# Corriger automatiquement les problemes formatables
pnpm lint:fix

# Build monorepo
pnpm build
```

## Commandes utiles par application

### Mobile (apps/mobile)

```bash
pnpm --filter @workspace/mobile dev
pnpm --filter @workspace/mobile android
pnpm --filter @workspace/mobile ios
pnpm --filter @workspace/mobile web
```

### API (apps/api)

```bash
pnpm --filter @workspace/api dev
pnpm --filter @workspace/api test
pnpm --filter @workspace/api test:watch
pnpm --filter @workspace/api test:cov
```

### Web (apps/web)

```bash
pnpm --filter @workspace/web dev
pnpm --filter @workspace/web build
pnpm --filter @workspace/web start
```

## Qualite et workflow

- Les commits sont verifies par Husky (hooks pre-commit)
- Le lint et le formatage sont appliques via lint-staged
- Les tests sont executes via Turborepo
- Le code partage est expose via le namespace `@workspace/*`

## Notes architecture

- Les alias TypeScript sont centralises dans `tsconfig.base.json`
- Les applications consomment les packages workspace directement
- Le package `@workspace/shared-utils` permet d'eviter la duplication de logique entre apps

## Objectif academique

Ce projet sert de support principal pour mon projet de fin d'etudes.

Il me permet de demontrer:

- la conception d'une application mobile orientee produit
- la mise en place d'une architecture fullstack moderne
- la gestion de la qualite logicielle (tests, lint, conventions de commit)
- l'industrialisation d'un projet via monorepo
