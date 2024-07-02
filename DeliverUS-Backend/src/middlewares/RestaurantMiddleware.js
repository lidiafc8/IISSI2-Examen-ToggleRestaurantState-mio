import { Restaurant, Order } from '../models/models.js'

const checkRestaurantOwnership = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findByPk(req.params.restaurantId)
    if (req.user.id === restaurant.userId) {
      return next()
    }
    return res.status(403).send('Not enough privileges. This entity does not belong to you')
  } catch (err) {
    return res.status(500).send(err)
  }
}
const restaurantHasNoOrders = async (req, res, next) => {
  try {
    const numberOfRestaurantOrders = await Order.count({
      where: { restaurantId: req.params.restaurantId }
    })
    if (numberOfRestaurantOrders === 0) {
      return next()
    }
    return res.status(409).send('Some orders belong to this restaurant.')
  } catch (err) {
    return res.status(500).send(err.message)
  }
}

// solucion
const checkRestaturantStatusCanBeChanged = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findByPk(req.params.restaurantId)
    const orders = await Order.findAll({ where: restaurant.id })

    if (restaurant.status === 'closed' || restaurant.status === 'temporarily closed') {
      return res.status(403).send('The status of this restaurant can not be changed')
    }

    for (const order of orders) {
      if (order.deliveredAt === null) {
        return res.status(403).send('The status of this restaurant can not be changed')
      }
    }
    return next()
  } catch (err) {
    return res.status(500).send(err.message)
  }
}

export { checkRestaurantOwnership, restaurantHasNoOrders, checkRestaturantStatusCanBeChanged }
