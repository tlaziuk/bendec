/** GENERATED BY BENDEC TYPE GENERATOR */
use serde::{Serializer, Serialize, Deserialize};
use serde_repr::{Serialize_repr, Deserialize_repr};
big_array! { BigArray; }
  // primitive built-in: u8

// primitive built-in: u16


#[repr(u8)]
#[derive(Debug, Copy, Clone, Serialize_repr, Deserialize_repr)]
pub enum AnimalKind {
  Zebra = 1,
  Toucan = 2,
}


#[repr(C, packed)]
#[derive(Serialize, Deserialize)]
pub struct Zebra {
  pub kind: AnimalKind,
  pub legs: u8,
}


#[repr(C, packed)]
#[derive(Serialize, Deserialize)]
pub struct Toucan {
  pub kind: AnimalKind,
  pub wingspan: u16,
}


#[repr(C, packed)]
pub union Animal {
  pub zebra: Zebra,
  pub toucan: Toucan,
}

impl Serialize for Animal {
  fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
  where S: Serializer,
  {
    unsafe {
      match &self.zebra.kind {
        AnimalKind::Zebra => self.zebra.serialize(serializer),
        AnimalKind::Toucan => self.toucan.serialize(serializer), 
      }
    }
  }
}


#[repr(u8)]
#[derive(Debug, Copy, Clone, Serialize_repr, Deserialize_repr)]
pub enum AnimalKind2 {
  Zebra2 = 1,
  Toucan2 = 2,
}


#[repr(C, packed)]
#[derive(Serialize, Deserialize)]
pub struct Header {
  pub animal_kind: AnimalKind2,
}


#[repr(C, packed)]
#[derive(Serialize, Deserialize)]
pub struct Zebra2 {
  pub header: Header,
  pub legs: u8,
}


#[repr(C, packed)]
#[derive(Serialize, Deserialize)]
pub struct Toucan2 {
  pub header: Header,
  pub wingspan: u16,
}


#[repr(C, packed)]
pub union Animal2 {
  pub zebra_2: Zebra2,
  pub toucan_2: Toucan2,
}

impl Serialize for Animal2 {
  fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
  where S: Serializer,
  {
    unsafe {
      match &self.zebra_2.header.animal_kind {
        AnimalKind2::Zebra2 => self.zebra_2.serialize(serializer),
        AnimalKind2::Toucan2 => self.toucan_2.serialize(serializer), 
      }
    }
  }
}

