const rand = require('random-key');

const keyHistory = [];

// Generates a new classroom key.
const generateKey = (req, res, next) => {
  const key = rand.generate(6);
  keyHistory.push(key);
  res.status(200).json({key});
};

// Checks whether an entered key is associated with a room.
const validateKey = (req, res, next) => {
  console.log('Validating key...');
  return keyHistory.includes(req.params.key)
    ? res.status(200).json({validated: true})
    : res.status(401).json({validated: false});
};

module.exports = {
  generateKey,
  validateKey,
};
