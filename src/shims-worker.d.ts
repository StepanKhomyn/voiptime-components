declare module '*?worker' {
  export default class WebpackWorker extends Worker {
    constructor();
  }
}

declare module '*?worker&inline' {
  export default class WebpackWorker extends Worker {
    constructor();
  }
}
