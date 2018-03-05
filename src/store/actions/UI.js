export const toggleCalendarsListVisibility = isVisible=>{
  return{
    type:"TOGGLE_CALENDAR",
    payload: isVisible
  }
}
export const toggleEventBuildVisibility = isVisible=>{
  return{
    type:"TOGGLE_EVENTBUILDER",
    payload: isVisible
  }
}
