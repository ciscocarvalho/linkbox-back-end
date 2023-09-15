// typings.d.ts
declare namespace NodeJS {
    interface ProcessEnv {
      PORT: any;
      HOST: string;
      DATABASE: string;
    }
  }