class Statistics {
  constructor (monkey, options) {
    this.monkey = monkey;
    this.options = options;
  }

  run (obj, msg) {
    if (msg[0] == "update player") {
      let portion = msg[1].portion;
      let value = msg[1].value;
      if (portion == "all") {
        console.log(value);
      }
    }
  }
}