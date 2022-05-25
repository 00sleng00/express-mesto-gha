const Card = require('../models/card');

const getCards = async (_, res) => {
  try {
    const users = await Card.find({});
    res.status(200).send(users);
  } catch (err) {
    res.status(500).send({
      message: 'Произошла ошибка сервера',
    });
  }
};

const createCard = async (req, res) => {
  try {
    const { name, link } = req.body;
    res
      .status(201)
      .send(await Card.create({ name, link, owner: req.user._id }));
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).send({
        message: 'Ошибка введеных данных',
      });
      return;
    }
    res.status(500).send({
      message: 'Произошла ошибка сервера',
    });
  }
};

const deleteCardId = async (req, res) => {
  try {
    const cardId = await Card.findByIdAndRemove(req.params.cardId);
    if (!cardId) {
      res.status(404).send({
        message: 'Карточка не найдена',
      });
    }
    res.status(200).send(cardId);
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(400).send({ message: 'Невалидный id' });
    }
    res.status(500).send({
      message: 'Произошла ошибка сервера',
    });
  }
};

const likeCard = async (req, res) => {
  try {
    const like = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    if (!like) {
      res.status(404).send({
        message: 'Карточка не найдена',
      });
      return;
    }
    res.status(200).send({ data: like });
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(400).send({
        message: 'Переданы некорректные данные',
      });
      return;
    }
    res.status(500).send({
      message: 'Произошла ошибка сервера',
    });
  }
};

const dislikeCard = async (req, res) => {
  try {
    const dislike = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    if (!dislike) {
      res.status(404).send({
        message: 'Карточка не найдена',
      });
      return;
    }
    res.status(200).send({ data: dislike });
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(400).send({
        message: 'Переданы некорректные данные',
      });
      return;
    }
    res.status(500).send({
      message: 'Произошла ошибка сервера',
    });
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCardId,
  likeCard,
  dislikeCard,
};
