const initialState = {
  calendarListShow:true,
  eventBuilderShow:false
}

export default function calendar(state = initialState, action) {
  switch (action.type) {
      case 'TOGGLE_CALENDAR':
        {
          return{
            ...state,
            calendarListShow: action.payload
          }     
        }
        case 'TOGGLE_EVENTBUILDER':
        {
          return{
            ...state,
            eventBuilderShow: action.payload
          }     
        }
      
      default:
          return state
  }
}