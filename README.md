# Sia

![Build Status](https://github.com/TimeleapLabs/ts-sia/actions/workflows/push-checks.yml/badge.svg?branch=master)

Sia serialization for JavaScript/TypeScript

## What is Sia?

Sia is the serialization library used by [Timeleap](https://github.com/TimeleapLabs/timeleap). Check more details on [Sia's official documentation](https://timeleap.swiss/docs/products/sia).

## Installation

```bash
npm install @timeleap/sia
```

## Usage

```python
import { Sia } from "@timeleap/sia";

const sia = new Sia();

sia
  .addString8("Hello")
  .addUint8(25)
  .addAscii("World");

console.log(sia.content);
```
