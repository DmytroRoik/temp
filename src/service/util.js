/**
   * Convert integer time to hh:mm format
   * @param {integer} dateTime - time in integer format
   * @returns {string} - time in hh:mm format 
   */
  export const getClock = dateTime => {
    let time = new Date(dateTime);
    return time.getHours() + ":" + (time.getMinutes()<10 ? "0" + time.getMinutes(): time.getMinutes());
  }

  /**
   * Translate msec to time in format "h:m"
   * @param { number } dateTime -- time(in msec) in number format 
   */
  export const getTimeString = dateTime => {
    let minutes = Math.floor( dateTime / 1000 / 60 );

    let h = Math.floor( minutes / 60 );
    let m = minutes - h * 60;
    return h + ":" + m;
  }