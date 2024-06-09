import "sst/node/config";
declare module "sst/node/config" {
  export interface ConfigTypes {
    APP: string;
    STAGE: string;
  }
}

import "sst/node/config";
declare module "sst/node/config" {
  export interface ParameterResources {
    "REGION": {
      value: string;
    }
  }
}

import "sst/node/config";
declare module "sst/node/config" {
  export interface ParameterResources {
    "COGNITO_DOMAIN": {
      value: string;
    }
  }
}

import "sst/node/config";
declare module "sst/node/config" {
  export interface ParameterResources {
    "USER_POOL_ID": {
      value: string;
    }
  }
}

import "sst/node/config";
declare module "sst/node/config" {
  export interface ParameterResources {
    "USER_POOL_CLIENT_ID": {
      value: string;
    }
  }
}

import "sst/node/config";
declare module "sst/node/config" {
  export interface ParameterResources {
    "USER_POOL_CLIENT_SECRET": {
      value: string;
    }
  }
}

import "sst/node/table";
declare module "sst/node/table" {
  export interface TableResources {
    "items": {
      tableName: string;
    }
  }
}

import "sst/node/config";
declare module "sst/node/config" {
  export interface ParameterResources {
    "ITEMS_TABLE_NAME": {
      value: string;
    }
  }
}

import "sst/node/table";
declare module "sst/node/table" {
  export interface TableResources {
    "apps": {
      tableName: string;
    }
  }
}

import "sst/node/config";
declare module "sst/node/config" {
  export interface ParameterResources {
    "APPS_TABLE_NAME": {
      value: string;
    }
  }
}

import "sst/node/function";
declare module "sst/node/function" {
  export interface FunctionResources {
    "Authorizer": {
      functionName: string;
    }
  }
}

import "sst/node/api";
declare module "sst/node/api" {
  export interface ApiResources {
    "Api": {
      url: string;
    }
  }
}

import "sst/node/config";
declare module "sst/node/config" {
  export interface ParameterResources {
    "API_ENDPOINT_URL": {
      value: string;
    }
  }
}

