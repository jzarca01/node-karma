const axios = require("axios");
const faker = require("faker");
const qs = require("qs");

const COMMON_HEADERS = {
  "Content-Type": "application/json",
  "Accept-Language": "fr-FR",
  "x-timezone": "Europe/Paris",
  "x-dev": 0,
  "x-version": "2.17",
  "x-platform": "ios",
};

const DEFAULT_TAGS = [
  "Favorites",
  "LastToday",
  "Tomorrow",
  "NearBy",
  "CollectNow",
  "Meals",
  "BakedGoods",
  "Groceries",
  "Recommended",
  "Breakfast",
  "Lunch",
  "Dinner",
  "TooGoodToGoStore",
  "EverythingElse",
  "SoldOut",
  "NothingToSave",
  "Vegetarian",
  "Unlocked",
  "EssentialBags",
];

class Karma {
  constructor({ email, password }) {
    this.internalRequest = axios.create({
      baseURL: "https://internal-api.karma.life",
      headers: COMMON_HEADERS,
    });

    this.discoverRequest = axios.create({
      baseURL: "https://discover-api.karma.life",
      headers: COMMON_HEADERS,
    });
    /*this.request = axios.create({
      baseURL: "https://apptoogoodtogo.com/api",
      headers: {
        "Content-Type": "application/json",
        "Accept-Language": "fr-FR",
      },
    });*/
    this.email = email;
    this.password = password;
    this.uuid = faker.random.uuid();
    this.userId = null;
    this.accessToken = null;
    this.passwordHash = null;

    this.internalRequest.interceptors.request.use(
      (axiosConfig) => {
        if (axiosConfig.url !== "/user/login") {
          Object.assign(axiosConfig.headers, {
            Authorization: `${this.accessToken}`,
          });
        }
        return axiosConfig;
      },
      (error) => Promise.reject(error)
    );
    this.discoverRequest.interceptors.request.use(
      (axiosConfig) => {
        Object.assign(axiosConfig.headers, {
          Authorization: `${this.accessToken}`,
        });
        return axiosConfig;
      },
      (error) => Promise.reject(error)
    );
  }

  setAccessToken(accessToken) {
    this.accessToken = accessToken;
  }

  setUserId(userId) {
    this.userId = userId;
  }

  setPasswordHash(passwordHash) {
    this.passwordHash = passwordHash;
  }

  async login() {
    try {
      const response = await this.internalRequest({
        url: "/user/login",
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        data: qs.stringify({
          password: this.password,
          username: this.email,
          uuid: this.uuid,
        }),
      });
      const {
        data: { access_token, user_id, password_hash },
      } = response.data;
      this.setAccessToken(access_token);
      this.setUserId(user_id);
      this.setPasswordHash(password_hash);
      return response.data;
    } catch (err) {
      console.log("error with login", err);
    }
  }

  async getProfile() {
    try {
      const response = await this.internalRequest({
        url: "/user",
        method: "GET",
      });
      return response.data;
    } catch (err) {
      console.log("error with getProfile", err);
    }
  }

  async getLocations({ latitude, longitude }, radius = 5000) {
    try {
      const response = await this.discoverRequest({
        url: "/v3/locations",
        method: "GET",
        headers: {
          "x-uuid": this.uuid,
        },
        params: {
          lat: latitude,
          long: longitude,
          radius: radius,
        },
      });
      return response.data;
    } catch (err) {
      console.log("error with getLocations", err);
    }
  }

  async getSales({ latitude, longitude }, radius = 5000) {
    try {
      const response = await this.discoverRequest({
        url: "/v3/sales",
        method: "GET",
        headers: {
          "x-uuid": this.uuid,
        },
        params: {
          lat: latitude,
          long: longitude,
          radius: radius,
        },
      });
      return response.data;
    } catch (err) {
      console.log("error with getSales", err);
    }
  }

  async getItems({ latitude, longitude }, radius = 5000) {
    try {
      const response = await this.discoverRequest({
        url: "/v3/items",
        method: "GET",
        headers: {
          "x-uuid": this.uuid,
        },
        params: {
          lat: latitude,
          long: longitude,
          radius: radius,
        },
      });
      return response.data;
    } catch (err) {
      console.log("error with getItems", err);
    }
  }

  async getSaleItemsProperties({ latitude, longitude }, radius = 5000) {
    try {
      const response = await this.discoverRequest({
        url: "/v3/saleitems/properties",
        method: "GET",
        headers: {
          "x-uuid": this.uuid,
        },
        params: {
          lat: latitude,
          long: longitude,
          radius: radius,
        },
      });
      return response.data;
    } catch (err) {
      console.log("error with getSaleItemsProperties", err);
    }
  }

  async getItemsByLocation(locationId) {
    try {
      const response = await this.discoverRequest({
        url: `/v1/locations/${locationId}/items`,
        method: "GET",
        headers: {
          "x-uuid": this.uuid
        }
      });
      return response.data;
    } catch (err) {
      console.log("error with getItemsByLocation", err);
    }
  }

  async getSalesByLocation(locationId) {
    try {
      const response = await this.discoverRequest({
        url: `/v2/locations/${locationId}/sales`,
        method: "GET",
        headers: {
          "x-uuid": this.uuid
        }
      });
      return response.data;
    } catch (err) {
      console.log("error with getSalesByLocation", err);
    }
  }

  async getSaleItemsPropertiesByLocation(locationId) {
    try {
      const response = await this.discoverRequest({
        url: `/v2/locations/${locationId}/saleitems/properties`,
        method: "GET",
        headers: {
          "x-uuid": this.uuid
        }
      });
      return response.data;
    } catch (err) {
      console.log("error with getSaleItemsPropertiesByLocation", err);
    }
  }
}

module.exports = Karma;
