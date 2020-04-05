# node-karma

An API wrapper for the anti-waste app [Karma](https://karma.life)

## Installation

```shell
yarn add node-karma
```

## Usage

```javascript
const Karma = require("node-karma");
const karma = new Karma({
  email: "",
  password: "",
});
```

## Methods

### Login

```javascript
await karma.login();
```

### Get profile

```javascript
await karma.getProfile();
```

### Get nearby locations

```javascript
await karma.getLocations({ latitude, longitude }, radius = 5000);
```

### Get nearby sales

```javascript
await karma.getSales({ latitude, longitude }, radius = 5000);
```

### Get nearby items

```javascript
await karma.getItems({ latitude, longitude }, radius = 5000);
```

### Get nearby sale items properties

```javascript
await karma.getSaleItemsProperties({ latitude, longitude }, radius = 5000);
```

### Get items by location

```javascript
await karma.getItemsByLocation(locationId);
```

### Get sales by location

```javascript
await karma.getSalesByLocation(locationId);
```

### Get sale items properties by location

```javascript
await karma.getSaleItemsPropertiesByLocation(locationId);
```
