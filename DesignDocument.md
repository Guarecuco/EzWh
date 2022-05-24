# Design Document 


Authors: 
* Alessio Carachino
* Samuele Giangreco
* Daniel Guarecuco
* Zoltan Mazzuco 

Date: 3 May, 2022

Version: 1.1


# Contents

- [Design Document](#design-document)
- [Contents](#contents)
- [Instructions](#instructions)
- [High level design](#high-level-design)
- [Low level design](#low-level-design)
- [Verification traceability matrix](#verification-traceability-matrix)
- [Verification sequence diagrams](#verification-sequence-diagrams)
  - [UC3, sc1-2 - Manage issue of restock orders](#uc3-sc1-2---manage-issue-of-restock-orders)
  - [UC5.1, sc 5.1.1 - Record restock order arrival](#uc51-sc-511---record-restock-order-arrival)
  - [UC5.2, sc 5.2.1, 5.2.2, 5.2.3](#uc52-sc-521-522-523)
  - [UC6, sc 6.2 - Return order of any SKU items](#uc6-sc-62---return-order-of-any-sku-items)

# Instructions

The design must satisfy the Official Requirements document, notably functional and non functional requirements, and be consistent with the APIs

# High level design 

The application is composed of the following packages:
* ***GUI***: Implementing the Graphical User Interface through a web browser.
* ***Data***:Implementing the model layer in a MVC architecture. It manages and processes all the data.
* ***Exceptions***:Implementing the exceptions handler, triggered by the user.

```plantuml
@startuml
package it.company.ezwh.gui as GUI
package it.company.ezwh as application
package it.company.ezwh.exceptions as exceptions
package it.company.ezwh.data as data
GUI - application
application - exceptions
data - application
exceptions -> data: import
@enduml
```
# Low level design

```plantuml
@startuml
top to bottom direction

class DataImpl {
  SKU
  SKUItem
  Position
  TestDescriptor
  TestResults
  Users
  RestockOrders
  ReturnOrders
  InternalOrders
  Item 
 --
  List<SKU> : getAllSKUs()
  SKU : getSKU(int SKUID)
  int : addSKU(JSON info)F
  void : updateSKU(int SKUID, JSON info)
  int : deleteSKU(int SKUID)
  --
  List<SKUItem> : getAllSKUItems()
  List<SKUItem> : getAvailableSKUItems(int SKUID)
  SKUItem : getSKUItem(int RFID)
  int : addSKUItem(JSON info)
  void : updateSKUItem(int RFID,JSON info)
  int : deleteSKUItem(int RFID)
  --
  Position : getAllPositions()
  int : addPosition(JSON info)
  void : updatePosition(string positionID, JSON info)
  void : updatePositionID(string positionID, JSON info)
  id : deleteSKUItemByPosition(string positionID)
  --
  List<TestDescriptor>: getAllTestDescriptors()
  TestDescriptor: getTestDescriptor(int ID)
  int: addTestDescriptor(JSON info)
  int: updateTestDescriptor(int ID, JSON info)
  int: deleteTestDescriptor(int ID) 
  --
  List<TestResults> : GetAllTestResults(int RFID)
  TestResults : GetTestResult(int RFID, int ID)
  Int: addTestResult(JSON info)
  Int: updateTestResult(int RFID, int ID, JSON info)
  Int: deleteTestResult(int RFID, int ID)
  --
  List: getLoggedUsers()
  List: getSuppliers()
  List: getUsers()
  Int: addUser(JSON info)
  Int: managerSession(JSON info)
  Int: customerSession(JSON info)
  Int: supplierSession(JSON info)
  Int: clerkSession(JSON info)
  Int: qualityEmployeeSession(JSON info)
  Int: deliveryEmployeeSession(JSON info)
  Int: logout()
  Int: updateUserType(email, JSON info)
  Int: deleteUserType(email, type)
  --
  List<RestockOrder>: getAllRestockOrders()
  List<RestockOrder>: getAllRestockOrdersIssued()
  RestockOrder: getRestockOrder(int ID)
  List<SKUItem>: getReturnableItems(int ID)
  Int: addRestockOrder(JSON Info)
  Int: updateRestockOrder(JSON info, int ID)
  Int: updateRestockOrderSKUItmes(JSON info, int ID)
  Int: updateRestockOrderTransportNote(JSON info, int ID)
  Int: deleteRestockOrder(int ID)
  --
  List<ReturnOrder>: getAllReturnOrders() 
  ReturnOrder: getReturnOrder(int ID)
  Int: addReturnOrder(JSON Info)
  Int: deleteReturnOrder(Int ID)
  --
  List<InternalOrder>: getAllInternalOrders()
  List<InternalOrder>: getAllIssuedInternalOrders()
  List<InternalOrder>: getAllAcceptedInternalOrders()
  InternalOrder: getInternalOrder(int ID)
  Int: addIssuedInternalOrder(JSON Info)
  Int: updateInternalOrder(JSON info, int ID)
  Int: deleteInternalOrder(int ID)
  --
  List<Item>: getAllItems()
  Item: getItem(int ID)
  Int: addItem(Item)
  Int: updateItem(JSON info, int ID)
  Int: deleteItem(int ID)
} 

Class User {
  ID
  name
  surname
  email
  password
  type
  void:setUserId(int Id)
  void:setUserName(string Name)
  void:setUserSurname(string Surname)
  void:setUserEmail(string Email)
  void:setPassword(string Password)
  void:setUserType(string Type)
  string: getUserData(string Email)
}

class Supplier {
  ID
  Name
  Void: setId(int Id)
  Void: setName(string Name)
  Int: getId()
  string:getName()
}

class Customer {
  ID
  name
  surname
}

class Item {
  ID
  description
  price
  SKUId
  supplierId
  void: setDescriptionAndPrice(string description, float price)
}

class A {
  quantity
}

class RestockOrder {
  ID
  issueDate
  state
  products
  supplierId
  transportNote
  SKUItems
  state
  RestockOrder: createRestockOrder(string issueDate, List<Item> products, int supplierId, string state)
 List<SKUItem>: getFaultySKUItems(ID)
 List<SKUItem>: getToBeReturnedSKUItems(ID)
 int: updateRestockOrder(string newState, int ID)
  void setIssueDate(string issueDate)
  void setState(string state)
  void setProducts(List<Item> products)
  void setSupplier(int id)
  void setSKUItems(List<SKUItem> skuItems)
  void setTransportNote(TransportNote transportNote)
}

class TransportNote {
  deliveryDate
}

class ReturnOrder {
  ID
  returnDate
  products
  restockOrderId
  void: setReturnDate(string date)
  void: setProducts(List<SKU> products)
  void: setRestockOrderId(int restockOrderId)
}

class SKU {
  ID
  description
  weight
  volume
  notes
  position
  availableQuantity
  price
  testDescriptors  
  void : setDescription(string description)
  void : setWeight(int weight)
  void : setVolume(int volume)
  void : setPrice(int price)
  void : setNotes(string notes)
  void : setAvailableQuantity(int quantity)
  int: getAvailableQuantity()
  SKU : getSKU()
  List<int> : GetTestDescriptors()
  int : updatePosition(string position)
}

class Inventory

class SKUItem {
  RFID
  Available
  DateOfStock
  Position

  Int getSKUId()
  int getAvailability()
  void : setRFID(int RFID)
  void : setAvailability(int Availability)
  void : setSKUId(int SKUId)
  void : setDateOfStock(string DateOfStock)
}

class AA {
  quantity
}

class TestDescriptor {
  ID
  name
  procedure description
  void: setTestDescriptor(int ID, string Name, string Description)
  String: getTestDescriptorName()
  String: getTestDescriptorDescription()
}


class TestResult {
  ID
  IdTestDescriptor
  RFID
  date
  Result
  void: setRFID(int RFID)
  int: addTestResult(JSON info)
  void: setIdTestDescriptor(int ID)
  void: setDate(string Date)
  void: setResult(boolean Result) 
  String: getDate()
  boolean: getResult()
}

class Warehouse

class Position {
  positionID
  aisleID 
  row
  col
  maxWeight
  maxVolume
  occupiedWeight
  occupiedVolume
  string : getPositionID()
  void : setPositionID()
  void : setAisleID()
  void : setRow()
  void : setCol()
  void : setMaxWeight()
  void : setMaxVolume()
  void : getSKUItem()
}

class InternalOrder {
  ID
  issueDate
  state
  products
  customerId
  string: getState()
  void: setState(string newState)
  void: setProducts(List<SKUItems> RFIDs)
 }

DataImpl – “*” SKUItem
DataImpl – “*” SKU
DataImpl – “*” Position
DataImpl -- “*” User
Position "*" -- Warehouse
Supplier -- "*" Item : sells
Supplier -- "*" RestockOrder
RestockOrder -- "*" Item
RestockOrder -- "0..1" TransportNote
RestockOrder -- "0..1" ReturnOrder : refers
RestockOrder -- "*" SKUItem
SKUItem "*" -- "0..1" ReturnOrder
SKU -- "*" SKUItem
SKU -- "*" Item : corresponds to 
Inventory -- "*" SKU
SKU "*" -- "*" TestDescriptor
TestDescriptor -- "*" TestResult
SKU "1" -- "1" Position: must be placed in
InternalOrder -- "*" SKU
InternalOrder "0..1" -- "*" SKUItem
SKUItem -- "*" TestResult
SKUItem "1" -- "0..1" Position
Customer -- "*" InternalOrder : places

(RestockOrder, Item) .. A
(InternalOrder, SKU) .. AA

note "positionID is the unique identifier of a position, 12 digits (only numbers),\n and is derived from the identifiers of aisle, row, col.  4 first digits for aisle, 4 for row, 4 for col " as N4
N4 .. Position

note "State\nISSUED = Restock order created\nDELIVERY = Supplier ship the order\nDELIVERED = order is received at warehouse\nTESTED = products of order have been tested\nCOMPLETEDRETURN = there is at least 1 item that hasn't passed tests\nCOMPLETED = all items have passed tests" as N5
N5 .. RestockOrder

note "State:\nISSUED = Internal Order created\nACCEPTED = Int Order accepted from manager\nREFUSED= I.O. refused from manager\nCANCELED = I.O. canceled from internal customer\nCOMPLETED= I.O. delivered to internal customer" as N6
N6 .. InternalOrder

note "bolla di accompagnamento " as N1  
N1 .. TransportNote

note "The ID of SKU is internal in the company " as N2  
N2 .. SKU

note " When items from a restock order are returned\n we suppose there's a single return order containing\n all items to be returned " as N3  
N3 .. ReturnOrder
@enduml
```





# Verification traceability matrix

|   | DataImpl |User| Supplier | Customer  | Item | A | RestockOrder | TranportNote | ReturnOrder | SKU | Inventory | SKUItem | AA | TestDescriptor | TestResult | Position | InternalOrder |  
| ----------------- |:-----------:|:-----------:|:-----------:|:-----------:|:-----------:|:-----------:|:-----------:|:-----------:|:-----------:|:-----------:|:-----------:|:-----------:|:-----------:|:-----------:|:-----------:|:-----------:|:-----------:|
|  FR1     |X|X||||||||||||||||
| FR2    |X|||||||||X||X||||||
| FR3    |X|||||||||X|X|X||X|X|X||
| FR4     |X|||X||||||||||||||
| FR5    |X||X||X||X|X||||||||||
| FR6  | X |||||X|X||||||X||||X|
| FR7  | X |||||||||X|X|X||||||














# Verification sequence diagrams 

## UC3, sc1-2 - Manage issue of restock orders

```plantuml
activate EzWh
EzWh->DataImpl: addRestockOrder(issueDate, products, supplierId)
activate DataImpl
DataImpl -> RestockOrder: createRestockOrder(issueDate, products, supplierId, issuedState)
activate RestockOrder
RestockOrder-> RestockOrder: setIssueDate(issueDate)
RestockOrder-> RestockOrder: setProducts(products)
RestockOrder -> RestockOrder: setSupplierId(supplierId)
RestockOrder-> RestockOrder: setState(issuedState)
RestockOrder--> DataImpl: restockOrderId
deactivate RestockOrder
DataImpl --> EzWh: Done
deactivate DataImpl
deactivate EzWh
```

## UC5.1, sc 5.1.1 - Record restock order arrival

```plantuml
@startuml
activate EzWh
EzWh->DataImpl: addSKUItem(RFID, SKUId, dateOfStock)
activate DataImpl
DataImpl -> SKUItem: createSKUItem(RFID, SKUId, dateOfStock)
activate SKUItem
SKUItem-> SKUItem: setRFID(RFID)
SKUItem-> SKUItem: setSKUId(SKUId)
SKUItem -> SKUItem: setDateOfStock(dateOfStock)
SKUItem--> DataImpl: SKUItemId
deactivate SKUItem
DataImpl --> EzWh: SKUItemId
EzWh->DataImpl: updateRestockOrder(deliveredState, id)
DataImpl -> RestockOrder: updateRestockOrder(id, deliveredState)
activate RestockOrder
RestockOrder --> DataImpl: Done
deactivate RestockOrder 
DataImpl --> EzWh: Done
deactivate DataImpl
deactivate EzWh
@enduml
```

## UC5.2, sc 5.2.1, 5.2.2, 5.2.3

```plantuml
@startuml
activate EzWh
loop for each SKUItem
EzWh->DataImpl: addTestResult(RFID, idTestDescriptor, date, result)
activate DataImpl
DataImpl -> TestResult: addTestResult(RFID, idTestDescriptor, date, result)
activate TestResult
TestResult -> TestResult: setResult(result)
TestResult-> TestResult: setDate(date)
TestResult -> TestResult: setIdTestDescriptor(idTestDescriptor)
TestResult -> TestResult: setRFID(RFID)
TestResult--> DataImpl: TestResultId
deactivate TestResult
DataImpl --> EzWh: TestResultId
EzWh->DataImpl: updateRestockOrder(testedState, id)
DataImpl -> RestockOrder: updateRestockOrder(id, testedState)
activate RestockOrder
RestockOrder --> DataImpl: Done
deactivate RestockOrder 
DataImpl --> EzWh: Done
deactivate DataImpl
end loop
deactivate EzWh
@enduml
```

## UC6, sc 6.2 - Return order of any SKU items
```plantuml
@startuml
activate EzWh
EzWh->DataImpl: getReturnableItems(ID)
activate DataImpl
DataImpl -> RestockOrder: getFaultySKUItems(ID)
activate RestockOrder
RestockOrder --> DataImpl: return faultySKUItems
DataImpl -> RestockOrder: getToBeReturnedSKUItems(ID)
RestockOrder --> DataImpl: return toBeReturnedSKUItems
deactivate RestockOrder
DataImpl -> DataImpl: union(faultySKUItems, toBeReturnedSKUItems)
DataImpl -->EzWh: return unionResult
EzWh -> DataImpl: addReturnOrder(returnDate, unionResult, roID)
DataImpl -> ReturnOrder: createReturnOrder(returnDate, unionResult, roID)
activate ReturnOrder
ReturnOrder -> ReturnOrder: setReturnDate(returnDate)
ReturnOrder -> ReturnOrder: setProducts(unionResult)
ReturnOrder -> ReturnOrder: setRestockOrderId(roID)
ReturnOrder -> DataImpl: return RO
deactivate ReturnOrder
activate SKUItem
activate SKU
activate Position
loop for each SKUItem as item
DataImpl -> SKUItem: setAvailability(0)
SKUItem --> DataImpl: Done
DataImpl -> SKU: setAvailableQuantity(item.getSKU().getAvailableQuantity()-1)
SKU --> DataImpl: Done
DataImpl -> Position: increasePosition(item)
Position --> DataImpl: Done
end loop
deactivate Position
deactivate SKU
deactivate SKUItem
DataImpl --> EzWh: Done
deactivate DataImpl
EzWh -> EzWh: notifySupplier()
activate EzWh
deactivate EzWh
deactivate EzWh
@enduml
```