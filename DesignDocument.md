# Design Document 


Authors: 
* Alessio Carachino
* Samuele Giangreco
* Daniel Guarecuco
* Zoltan Mazzuco 

Date: 21 June, 2022

Version: 2.5


# Contents

- [Design Document](#design-document)
- [Contents](#contents)
- [Instructions](#instructions)
- [High level design](#high-level-design)
- [Low level design](#low-level-design)
- [Verification traceability matrix](#verification-traceability-matrix)
- [Verification sequence diagrams](#verification-sequence-diagrams)
  - [UC3, sc1-2 - Manage issue of restock orders](#uc3-sc1-2---manage-issue-of-restock-orders)
  - [UC4, sc4-1 - Issue internal order to warehouse](#uc4-sc4-1---issue-internal-order-to-warehouse)
  - [UC5.1, sc 5.1.1 - Record restock order arrival](#uc51-sc-511---record-restock-order-arrival)
  - [UC5.2, sc 5.2.1, 5.2.2, 5.2.3](#uc52-sc-521-522-523)
  - [UC6, sc 6.2 - Return order of any SKU items](#uc6-sc-62---return-order-of-any-sku-items)

# Instructions

The design must satisfy the Official Requirements document, notably functional and non functional requirements, and be consistent with the APIs

# High level design 


_Architectural patterns_:
* MVC
* layered - 3 tiered

The application is composed of the following packages:
* ***EZWH_GUI***: Implementing the Graphical User Interface through a web browser.
* ***EZWH_SERVER***: Implementing the controller layer in a MVC architecture. It performs interactions on the data model objects and responds to the user input. 
* ***EZWH_DATA***:Implementing the model layer in a MVC architecture. It manages and processes all the data.


```plantuml
@startuml
package EZWH_GUI
package EZWH_SERVER
package EZWH_DATA
EZWH_GUI - EZWH_SERVER
EZWH_SERVER- EZWH_DATA
@enduml
```
# Low level design

```plantuml
@startuml
top to bottom direction

class DataImpl {
  SKU
  SKUItem
  Item
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
 List<Item> : getAllItems()
Item: getItemByIdAndSupplierId(int id, int supplierdId)
int: addItem(JSON info)
void: updateItemByIdAndSupplierId(int id, int supplierdId, JSON info)
void: deleteItemByIdAndSupplierId(int id, int supplierdId)
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
  username
  password
  type
 List<User>:getStoredSuppliers()
  List<User>:getStoredUsers()
  List<User>:getStoredUsersWithoutManagers()
  User:getUserByEmailType(user)
  int:checkIfStored(user)
  void:storeUser(user)
  void:deleteUser(user)
  void:updateUser(user)

}

Class Item{
ID
description
price
SKUId
supplierId
 List<Item> : getAllItems()
Item: getItemByIdAndSupplierId(int id, int supplierdId)
int: addItem(JSON info)
void: updateItemByIdAndSupplierId(int id, int supplierdId, JSON info)
void: deleteItemByIdAndSupplierId(int id, int supplierdId)
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
  List<RestockOrder> getAllRestockOrders()
  List<RestockOrder> getAllRestockOrdersIssued()
  int checkIfStored(id)
  RestockOrder getRestockOrder(id)
  int addRestockOrder(issueDate, supplierId, products)
  int updateRestockOrder(state, id)
  int updateRestockOrderSKUItems(skuItems, id)
  int updateRestockOrderTransportNote(id, transportNote)
  int deleteRestockOrder(id)
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
   List<ReturnOrder> getAllReturnOrders()
   int checkIfRestockOrderExists(restockOrderId)
   ReturnOrder getReturnOrder(id)
   Int addReturnOrder(returnDate, products, restockOrderId)
   int deleteReturnOrder(id)

  void: setReturnDate(string date)
  void: setProducts(List<SKU> products)
  void: setRestockOrderId(int restockOrderId)
}

class SKU {
  id
  description
  weight
  volume
  notes
  position
  availableQuantity
  price
  testDescriptors 
  void : storeSku(sku)
  List<sku> : getStoredSkus()
  List<sku> : getSku(id)
  void : updateSku(id,sku)
  void : setPosition(id,position)
  void : deleteSku(id)
  void : setAvailableQuantityById(id, newQty)
}

class Inventory

class SKUItem {
  rfid
  Available
  DateOfStock
  Position

  List<skuitem> : getStoredSkuitems()
  void : storeSkuitem(skuitem)
  List<skuitem> : getStoredSkuitem(rfid)
  List<skuitem> : getAvailableSkuitems(SKUId)
  void : setAvailabilityByRFID(rfid, newQty)
  void : updateSkuitem(rfid,skuitem)
  void : deleteSkuitem(rfid)
}

class AA {
  quantity
}

class TestDescriptor {
  ID
  name
  procedure description
  idSKU
  Void setName()
  Void setProcedureDescription()
  void idSku()
  int: newTableTests()
  void: getTestsDescriptors()
  void: getTestDescriptor(json)
void: findTestName(json)
void: findTestId(json)
int: addTest(json)
int: updateTest(json)
int: deleteTest(json)
void: getSKUDescriptors(String)
boolean: deleteAllTests()
boolean: dropTestsTable()
}


class TestResult {
  ID
  IdTestDescriptor
  RFID
  date
  Result
  void setIdTestDescriptor()
  void setRfid()
  void setDate()
  Void setResult()
 int: newResultTests()
  void: getSKUResults(json)
  void: getSKUResult(json)
int: addResult(json)
int: updateResult(json)
int: deleteResult(json)
void: countFailedTest(String)
boolean: deleteAllResult()
boolean: dropResultsTable()
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
  void : storePosition(position)
  List<position> : getStoredPositions()
  position : getPosition(id)
  void : updatePositionID(id,position)
  void : changePositionID(oldPosID,newPosID)
  void : updateDimensions(volume,weight,availableQuantity,position)
  void : deletePosition(id)
}

class InternalOrder {
  ID
  issueDate
  state
  products
  customerId
  void:storeInternalOrder(order)
  void:storeInternalOrderProducts(order.products)
  void:updateInternalOrder(order)
  void:updateInternalOrderProducts(order.products)
  void:deleteInternalOrder(order)
  void:deleteInternalOrderProducts(order.products)
  int:checkIfOrderExists(order)
  List<InternalOrder>:getInternalOrders()
  List<products>:getInternalOrdersProducts(order.id)
  List<products>:getInternalOrdersProductsCompleted(order.id)
  List<InternalOrder>:getInternalOrdersByState(state)
  InternalOrder:getInternalOrdersbyID(order.id)

 }

DataImpl – “*” SKUItem
DataImpl – “*” Item
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
RestockOrder -- "*" Item
SKUItem "*" -- "0..1" ReturnOrder
Item "*" -- "0..1" ReturnOrder
SKU -- "*" SKUItem
SKU – “*” Item
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
DataImpl -> RestockOrder: addRestockOrder(issueDate, products, supplierId)
activate RestockOrder
RestockOrder-> RestockOrder: setIssueDate(issueDate)
RestockOrder-> RestockOrder: setProducts(products)
RestockOrder -> RestockOrder: setSupplierId(supplierId)
RestockOrder-> RestockOrder: setState('ISSUED')
RestockOrder--> DataImpl: restockOrderId
deactivate RestockOrder
DataImpl --> EzWh: Done
deactivate DataImpl
deactivate EzWh
```
## UC4, sc4-1 - Issue internal order to warehouse
```plantuml
@startuml
activate EzWh
EzWh->DataImpl: POST /api/internalOrder
activate DataImpl
DataImpl-> InternalOrder: storeInternalOrder(issueDate,state,products,customerId)
activate InternalOrder
InternalOrder --> InternalOrder: orderId
loop for each SKU in products
InternalOrder -> Sku: getSku(products.SKUId)
activate Sku
Sku --> InternalOrder: qty
deactivate Sku
InternalOrder -> Sku: setAvailableQuantityById(products.SKUId, newQty)
activate Sku
Sku --> InternalOrder: Done
deactivate Sku
end loop
InternalOrder --> DataImpl: Done
deactivate InternalOrder
DataImpl --> EzWh : Done
deactivate DataImpl
deactivate EzWh
@enduml
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
RestockOrder -> RestockOrder: setState('DELIVERED')
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
RestockOrder -> RestockOrder: setState('TESTED')
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
DataImpl -> RestockOrder: getRestockOrder(ID)
activate RestockOrder
RestockOrder --> DataImpl: return restockOrder
loop for each restockOrder.skuItems as item
DataImpl -> TestResult: countFailedTest(item.rfid)
activate TestResult
TestResult --> DataImpl: return count
alt count > 0
DataImpl -> DataImpl: push(failedItems, item)
end loop
deactivate RestockOrder
DataImpl -->EzWh: return failedItems
EzWh -> DataImpl: addReturnOrder(returnDate, failedItems, roID)
DataImpl -> ReturnOrder: addReturnOrder(returnDate, failedItems, roID)
activate ReturnOrder
ReturnOrder -> ReturnOrder: setReturnDate(returnDate)
ReturnOrder -> ReturnOrder: setProducts(failedItems)
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
