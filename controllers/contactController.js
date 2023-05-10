const asyncHandler = require("express-async-handler");
const Contact = require("../models/contactModel");

// Get contacts
const getContacts = asyncHandler(async (req, res) => {
  const contacts = await Contact.find({ user_id: req.user.id });

  res.json(contacts);
});

//Create contact
const createContact = asyncHandler(async (req, res) => {
  console.log("The body is:", req.body);
  const { name, email, phone } = req.body;
  if (!name || !email || !phone) {
    res.status(400);
    throw new Error("All fields are required!");
  }

  const contact = await Contact.create({
    name,
    email,
    phone,
    user_id: req.user.id,
  });

  res.status(201).json(contact);
});

//Get contact by id
const getContactById = asyncHandler(async (req, res) => {
  const id = req.params.id;

  const contact = await Contact.findById(id);
  if (!contact) {
    res.status(404);
    throw new Error("Item is not found!");
  }

  res.json(contact);
});

//Update contact
const updateContact = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const contact = await Contact.findById(id);
  if (!contact) {
    res.status(404);
    throw new Error("Item is not found!");
  }

  if (contact.user_id.toString() !== req.user.id) {
    res.status(403);
    throw new Error("User don't have permission to update other user contacts");
  }

  const updatedContact = await Contact.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  res.status(200).json(updatedContact);
});

//Delete contact
const deleteContact = asyncHandler(async (req, res) => {
  const id = req.params.id;

  const contact = await Contact.findById(id);
  if (!contact) {
    res.status(404);
    throw new Error("Item is not found!");
  }

  if (contact.user_id.toString() !== req.user.id) {
    res.status(403);
    throw new Error("User don't have permission to delete other user contacts");
  }

  const deletedContact = await Contact.findByIdAndDelete(id, req.body, {
    new: true,
  });
  // await Contact.deleteOne({ _id: req.params.id  });

  res.json(deletedContact);
});

module.exports = {
  getContacts,
  createContact,
  getContactById,
  updateContact,
  deleteContact,
};
