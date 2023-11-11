declare global {
  declare namespace App {
    interface Locals {
      auth: import("lucia").AuthRequest;
    }
    interface PageData {}
    // interface Platform {}
    // interface PrivateEnv {}
    // interface PublicEnv {}
    // interface Session {}
    // interface Stuff {}
  }
}

/// <reference types="lucia" />
declare namespace Lucia {
  type Auth = import("$lib/server/lucia").Auth;
  // we omit the id property because lucia automatically generate it for us when we create a user
  type DatabaseUserAttributes = {
    username: string;
    names: string;
    last_names: string;
  };
  type DatabaseSessionAttributes = {};
}

export {};
