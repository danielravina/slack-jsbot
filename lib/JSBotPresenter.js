export default function JSBot() {
  // the stuff you get from the parser
  let _payload = {}

  const process = (payload) => {
    _payload = payload
  }

  return {
    process: process
  }

}