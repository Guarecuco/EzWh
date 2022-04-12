# Graphical User Interface Prototype  

Authors: 
* Alessio Carachino
* Samuele Giangreco
* Daniel Guarecuco
* Zoltan Mazzuco

Date: 13 april 2022

Version: #1


# Screenshots

## Case 1 - Log-in

### Regular Log-in
![ManagerLogin](GUIimages/Login.png)

This is the view presented to all users trying to use the application. If any user tries to connect to any other page without being authenticated, they will be redirected here for login.

* The user is requested to provide e-mail and password.
* The ***Login*** button send the form for authentication with the backend.
  * If it is the first time the user tries to log in, they will be redirected to the [Firt-time log-in](#firt-time-log-in) screen.
  * Otherwise, they will be redirected to the [Dashboard](#case-2---dashboard) screen.

### Firt-time Log-in

![ManagerLogin](GUIimages/Firstlogin.png)

This view is presented to all users that are trying to access the application for the first time after the administrator have created their accounts. They are requested to change their default password. Failure to change the password will reject the authentication.
* By pressing ***Submit*** the user is redirected to the [Dashboard](#case-2---dashboard) screen.


## Case 2 - Dashboard
![MainMenu](GUIimages/Mainmenu.png)

The main menu of the application it is possible to [Manage items](#case-3---manage-items), [Manage users](#manage-users), 


## Case 3 - Manage items
![ManageItems](GUIimages/ManageItems.png)

This view shows the available items in the warehouse and their informations:
* ID: is a unique identifier for an item sold by a specific Company
* Category
* Product/Item
* Name/Company: is the supplier from which the item is bought
* Min Amount: shows the minimum amount of that item that we always want to have available, it checks all the Suppliers it is bought from
* Amount: shows the amount of that item that is available in the warehouse
* Price: is the price at which the supplier sells the item
* Shelf: is the physical position of the item in the warehouse

* Options:
  * By pressing ***Edit*** the user is redirected to the [Edit Items](#edit-items) screen.

Items can be filtered by category, item or company or a more specific search could be done with the search bar on the right. 
Changing the granularity of the view means that some tabs will not be shown for example the price when we are grouping by items.

### Edit items
![EditItems](GUIimages/EditItem.png)
For each product it is possible to modify the quantity, the price and its position.
Changes can be confirmed or Aborted.


## Case 4 - Manage users

### Manage users
![Manageuser](GUIimages/ManageUsers.png)
In this page the administrator is able to see several informations about employees and suppliers, and they can be filtered by role or searched by many attributes.

A new user can be added by pressing ***Add user*** where we can add a [New Employee](#new-employee) or a 
[New Supplier](#new-supplier)

It is possible to [edit a user](#edit-user) by selecting ***Edit*** or removing one with ***Remove***

### New employee
![NewUserEmployee](GUIimages/CreateUser_OU_Manager.png)


### New supplier
![NewUserSupplier](GUIimages/CreateUser_Supplier.png)


### Edit user
![EditEmployee](GUIimages/EditUser_OU_Manager.png)



## Case 5 - Manage orders

### List orders to suppliers
![OrderSupplier](GUIimages/ManageOrders_suppliers.png)

### Order details
![OrderDetails](GUIimages/OrderDetails_Suppliers.png)

### List internal orders
![OrderInternal](GUIimages/ManageOrders_internal.png)

### Placing orders
![PlacingOrder](GUIimages/InternalOrder.png)

![OrderConfirmation](GUIimages/InternalOrderconfirmation.png)

### Placing orders to suppliers
![IssueOrder](GUIimages/IssueOrder.png)



## Case 6 - Manage suppliers
### Manage supplier
![ManageSupplier](GUIimages/ManageSuppliers.png)

### Edit supplier
![EditSupplier](GUIimages/EditUser_Supplier.png)

### Add item supplier
![EditSupplier](GUIimages/NewItem.png)

### Supplier catalogue
![SupplierCatalogue](GUIimages/SupplierCatalogue.png)



## Case 7 - Quality check
![QualitySupervision](GUIimages/QualitySupervision.png)

![QualityCheck](GUIimages/Qualitycheck.png)



## Case 8 - Show warehouse
![WarehouseOverview](GUIimages/Warehouseoverview.png)


