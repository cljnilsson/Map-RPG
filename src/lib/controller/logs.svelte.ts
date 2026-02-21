import LogStore from "$lib/stores/logs.svelte";
import { SvelteDate } from "svelte/reactivity";

class LogController {
  get currentPage() {
    return LogStore.currentPage;
  }

  set currentPage(v: number) {
    if (v < 0) {
      console.warn("Page set to negative, probably an error!");
    }

    LogStore.currentPage = v;
  }

  get logs() {
    return LogStore.logs;
  }

  public newLog(msg: string, type: "warning" | "error" | "info" = "info") {
    if (msg.length <= 0 || msg.length > 300) {
      console.warn("Log message is empty or very long. " + msg.length);
      return;
    }

    LogStore.logs = [
      ...LogStore.logs,
      {
        timestamp: new SvelteDate(),
        message: msg,
        type: type,
      },
    ];

    console.log(`Frontned log [${type}]: `, msg);
  }
}

const instance = new LogController();

export default instance;
