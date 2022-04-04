
 #Requirements Document 

Date: 22 march 2022

Version: 0.0

 
| Version number | Change |
| ----------------- |:-----------|
| 0.1 | | 


# Contents

- [Informal description](#informal-description)
- [Stakeholders](#stakeholders)
- [Context Diagram and interfaces](#context-diagram-and-interfaces)
	+ [Context Diagram](#context-diagram)
	+ [Interfaces](#interfaces) 
	
- [Contents](#contents)
- [Informal description](#informal-description)
- [Stakeholders](#stakeholders)
- [Context Diagram and interfaces](#context-diagram-and-interfaces)
	- [Context Diagram](#context-diagram)
	- [Interfaces](#interfaces)
- [Stories and personas](#stories-and-personas)
- [Functional and non functional requirements](#functional-and-non-functional-requirements)
	- [Functional Requirements](#functional-requirements)
	- [Non Functional Requirements](#non-functional-requirements)
- [Use case diagram and use cases](#use-case-diagram-and-use-cases)
	- [Use case diagram](#use-case-diagram)
		- [Use case 1, UC1 - Manage users](#use-case-1-uc1---manage-users)
				- [Scenario 1.1](#scenario-11)
				- [Scenario 1.2](#scenario-12)
				- [Scenario 1.3](#scenario-13)
				- [Scenario 1.4](#scenario-14)
				- [Scenario 1.x](#scenario-1x)
				- [Scenario 1.x](#scenario-1x-1)
		- [Use case 2, UC2](#use-case-2-uc2)
		- [Use case x, UCx](#use-case-x-ucx)
- [Glossary](#glossary)
- [System Design](#system-design)
- [Deployment Diagram](#deployment-diagram)

# Informal description
Medium companies and retailers need a simple application to manage the relationship with suppliers and the inventory of physical items stocked in a physical warehouse. 
The warehouse is supervised by a manager, who supervises the availability of items. When a certain item is in short supply, the manager issues an order to a supplier. In general the same item can be purchased by many suppliers. The warehouse keeps a list of possible suppliers per item. 

After some time the items ordered to a supplier are received. The items must be quality checked and stored in specific positions in the warehouse. The quality check is performed by specific roles (quality office), who apply specific tests for item (different items are tested differently). Possibly the tests are not made at all, or made randomly on some of the items received. If an item does not pass a quality test it may be rejected and sent back to the supplier. 

Storage of items in the warehouse must take into account the availability of physical space in the warehouse. Further the position of items must be traced to guide later recollection of them.

The warehouse is part of a company. Other organizational units (OU) of the company may ask for items in the warehouse. This is implemented via internal orders, received by the warehouse. Upon reception of an internal order the warehouse must collect the requested item(s), prepare them and deliver them to a pick up area. When the item is collected by the other OU the internal order is completed. 

EZWH (EaSy WareHouse) is a software application to support the management of a warehouse.



# Stakeholders


| Stakeholder name  | Description | 
| ----------------- |:-----------:|
|   Managers    |             | 
|   Suppliers     |             | 
|   Quality supervisors     |             | 
|   Retailers     |             | 
|   Competitors     |             | 
|   Shipping companies     |             | 
|   Company's OU     |             | 
|   local policies     |             | 
|   Physical organization  |             | 
|   Pick up area  |             | 
|   Employees     |             | 
|   Financial Unit     |             |
|   Payment Service    |             |
|   Administrator     |             | 





# Context Diagram and interfaces

## Context Diagram
\<Define here Context diagram using UML use case diagram>

\<actors are a subset of stakeholders>

## Interfaces
\<describe here each interface in the context diagram>

\<GUIs will be described graphically in a separate document>

| Actor | Logical Interface | Physical Interface  |
| ------------- |:-------------:| -----:|
|   Employee     | GUI | Internet connection, Smartphone/PC |
|   User     | GUI | Internet connection, Smartphone/PC |
|   Manager     | GUI | Internet connection, Smartphone/PC |
|   Quality supervisor     | GUI | Internet connection, Smartphone/PC  |
|   Payment service     | APIs | Internet connection |
|   Organizational unit     | GUI | Internet connection, Smartphone/PC |
|   Supplier     | GUI | Internet connection, Smartphone/PC  | 
|   Retailer     | GUI | Internet connection, Smartphone/PC |
|   IT Administrator     | GUI | Internet connection, Smartphone/PC |



# Stories and personas
\<A Persona is a realistic impersonation of an actor. Define here a few personas and describe in plain text how a persona interacts with the system>

\<Persona is-an-instance-of actor>

\<stories will be formalized later as scenarios in use cases>


# Functional and non functional requirements

## Functional Requirements

\<In the form DO SOMETHING, or VERB NOUN, describe high level capabilities of the system>

\<they match to high level use cases>

| ID        | Description  |
| ------------- |:-------------:| 
|  FR1     | Manage users  |
|  FR1.1     | Define a new user, or modify an existing user  |
|  FR1.2  | Delete a user | 
|  FR1.3  | List all users | 
|  FR1.4  | Search a user | 
|  FR1.5  | Manage roles Authorize access to functions to specific actors according to access roles | 
|  FR2  | Manage orders | 
|  FR2.1  | Create/Receive orders | 
|  FR2.2  | Modify/delete an order | 
|  FR2.3  | Provide order status |
|  FR3  | Manage items | 
|  FR3.1  | Check quality |
|  FR3.2  | Reject the item |
|  FR3.3  | Track position | 
|  FR3.4  | Quantity reports |
|  FR3.5  | Modify Quantity |
|  FR3.6  | Search an item |
|  FR4  | Receive payments |
|  FR5  | Log in |
|  FR5.1  | Log out |







## Non Functional Requirements

\<Describe constraints on functional requirements>

| ID        | Type (efficiency, reliability, ..)           | Description  | Refers to |
| ------------- |:-------------:| :-----:| -----:|
|  NFR1     | Efficiency  | All functions should complete in < 0.5 sec  | |
|  NFR2     | Reliability | Percentage of time the product is / is not available to end user | |
|  NFR3     | Correctness | Capability to provide intended functionality in ALL cases | |
|  NFR3     | Usability | Effort needed to learn using the product | |
|  NFR3     | Security | Access only to authorized users | |
| Domain | Currency is Euro | | | 


# Use case diagram and use cases


## Use case diagram
![Installation](diagrams/test.dio)


\<next describe here each use case in the UCD>
### Use case 1, UC1 - Manage users
| Actors Involved        | IT Administrator, U |
| ------------- |:-------------:| 
|  Precondition     | \<Boolean expression, must evaluate to true before the UC can start> |
|  Post condition     | \<Boolean expression, must evaluate to true after UC is finished> |
|  Nominal Scenario     | \<Textual description of actions executed by the UC> |
|  Variants     | \<other normal executions> |
|  Exceptions     | \<exceptions, errors > |

##### Scenario 1.1 

\<describe here scenarios instances of UC1>

\<a scenario is a sequence of steps that corresponds to a particular execution of one use case>

\<a scenario is a more formal description of a story>

\<only relevant scenarios should be described>

| Scenario 1.1 | Create user |
| ------------- |:-------------:| 
|  Precondition     | User U does not exist |
|  Post condition     | User U exists |
| Step#        | Description  |
|  1   | IT Administrator asks the system to create account of User U   |  
|  2  | application asks for name, surname, email, working role |
|  3  | IT Administrator enters name, surname, email, working role |
|  4  | application checks wheter there is no other account with the specified informations   |
|  5  | application creates account for user U   |
|  Exception     | User U already exists but with different working role, abort |
|  Exception     | User U already exists but with same working role, the system deletes the old one and create the new one |


##### Scenario 1.2

\<describe here scenarios instances of UC1>

\<a scenario is a sequence of steps that corresponds to a particular execution of one use case>

\<a scenario is a more formal description of a story>

\<only relevant scenarios should be described>

| Scenario 1.2 | Read users |
| ------------- |:-------------:| 
|  Precondition     | IT Administrator is logged in the system |
|  Post condition     | - |
| Step#        | Description  |
|  1     | IT Administrator asks the system to access to users' overview in tabular format|  
|  2     | System prompts the requested informations |
|  3     | IT Administrator picks one of the user to read more details  |
|  4     | System prompts user's details  |
|  Variants     | Search by user id/name+surname. The system shows the user's details  |
|  Variants     | Sort by role. The system shows users in hierarchical order   |
|  Variants     | Sort by seniority. The system shows users in ascending order   |



##### Scenario 1.3

\<describe here scenarios instances of UC1>

\<a scenario is a sequence of steps that corresponds to a particular execution of one use case>

\<a scenario is a more formal description of a story>

\<only relevant scenarios should be described>

| Scenario 1.3 | Modify user |
| ------------- |:-------------:| 
|  Precondition     | IT Administrator is logged in the system |
|  Post condition     | One or more users have been modified |
| Step#        | Description  |
|  1     | IT Administrator asks the system to access to users' overview in tabular format|  
|  2     | System prompts the requested informations |
|  3     | IT Administrator selects a user U to modify  |
|  4     | System prompts user's details  |
|  5     | IT Administrator modifies U's informations and/or working role  |
|  6     | Application updates U's informations  |
|  Variants     | Search by user id/name+surname. The system shows the user's details  |
|  Variants     | Sort by role. The system shows users in hierarchical order   |
|  Variants     | Sort by seniority. The system shows users in ascending order   |
|  Exception     | Selected User U's permissions block the request, abort |


##### Scenario 1.4

\<describe here scenarios instances of UC1>

\<a scenario is a sequence of steps that corresponds to a particular execution of one use case>

\<a scenario is a more formal description of a story>

\<only relevant scenarios should be described>

| Scenario 1.1 | Delete user |
| ------------- |:-------------:| 
|  Precondition     | IT Administrator is logged in the system |
|  Post condition     | User U is deleted |
| Step#        | Description  |
|  1     | IT Administrator asks the system to access to users' overview in tabular format  |  
|  2     | System prompts the requested informations |
|  3     | IT Administrator selects a user U to delete  |
|  4     | System prompts user's details  |
|  5     | IT Administrator deletes User U  |
|  6     | Application updates U's status  |
|  Variants     | Search by user id/name+surname. The system shows the user's details  |
|  Variants     | Sort by role. The system shows users in hierarchical order   |
|  Variants     | Sort by seniority. The system shows users in ascending order   |
|  Exception     | Selected User U's permissions block the request, abort |


##### Scenario 1.x

\<describe here scenarios instances of UC1>

\<a scenario is a sequence of steps that corresponds to a particular execution of one use case>

\<a scenario is a more formal description of a story>

\<only relevant scenarios should be described>

| Scenario 1.1 | Create user |
| ------------- |:-------------:| 
|  Precondition     | \<Boolean expression, must evaluate to true before the scenario can start> |
|  Post condition     | \<Boolean expression, must evaluate to true after scenario is finished> |
| Step#        | Description  |
|  1     |  |  
|  2     |  |
|  ...     |  |

##### Scenario 1.x














### Use case 2, UC2
..

### Use case x, UCx
..



# Glossary

\<use UML class diagram to define important terms, or concepts in the domain of the system, and their relationships> 

\<concepts are used consistently all over the document, ex in use cases, requirements etc>

# System Design
\<describe here system design>

\<must be consistent with Context diagram>

# Deployment Diagram 

\<describe here deployment diagram >




