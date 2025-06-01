import { Route as rootRoute } from './routes/__root'
import { Route as indexRoute } from './routes/index'
import { Route as ticketsRoute } from './routes/tickets'
import { Route as successRoute } from './routes/success'
import { Route as userTicketsRoute } from './routes/user-tickets'

export const routeTree = rootRoute.addChildren([
  indexRoute,
  ticketsRoute,
  successRoute,
  userTicketsRoute,
]) 