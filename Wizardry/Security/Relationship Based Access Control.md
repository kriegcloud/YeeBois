## Introduction 

ReBAC is a policy model focused exclusively on the relationships, or how resources and identities (aka users) are connected to each other and between themselves. These connections are used to implement Authorization- i.e. ensuring that **the right people and services have the right access to the right resources** (Not to be [confused with Authentication](https://www.permit.io/blog/authn-vs-authz "https://www.permit.io/blog/authn-vs-authz")). 

ReBAC is an alternative model to other common ones - such as [Role Based Access Control (RBAC)](https://www.permit.io/blog/rbac-with-permit "https://www.permit.io/blog/rbac-with-permit") and [Attribute Based Access Control (ABAC)](https://www.permit.io/blog/what-is-abac "https://www.permit.io/blog/what-is-abac"). Note that these models are more thinking tools than concrete guidelines, and most applications end up mixing between them (especially as time passes and the applications evolve). It’s up to developers to pick the most suitable authorization model for their application at each moment in time. 

In this blog, we will dive into what Relationship-Based Access Control (ReBAC) is, examine the pros and cons of this model to better understand the use cases that it’s suitable for, discuss the importance of scalable implementation, and see implementation options, including with Permit.io - a no-code UI solution for authoring and managing Policy as Code.

## Policy as a Graph

Relationship-Based Access Control (ReBAC) extends RBAC by considering **relationships between identities and resources**. The consideration of these relationships allows us to create authorization policies for **hierarchical structures**.

It is easiest to visualize ReBAC **as a graph**, with each node on the graph representing a resource or identity, and each edge representing a relationship. 

Graph-based authorization systems are perfect for mapping **hierarchies and nested relationships.** Given their ability to manage high volumes of data while maintaining consistency, these systems also prove effective in large-scale environments.

## So how does ReBAC help us exactly? 

The simplest example to portray the capabilities of ReBAC is by looking at an example of any file system (e.g. [Google Drive](https://docs.permit.io/modeling/google-drive "https://docs.permit.io/modeling/google-drive")): 

![ReBAC 1.png](https://media.graphassets.com/rP7TGtwCSSej5IcIpBKD "ReBAC 1.png")

This graph displays a folder titled “Bob’s Files”. Within that folder, there are two additional folders - “Bob’s Docs” and “Bob’s Pics”. Inside each of these folders are several files. How would we go about managing Bob’s access to his files? 

To understand how ReBAC helps us do this, we need to understand two basic terms:

**Role Derivation** -   
  
ReBAC allows us to **derive** authorization policies **based on existing application-level relationships.** Put in the simplest way, it allows us to create a policy like this:

A **user** who is assigned the role of an **Owner** on a **folder** will also get the **Owner** role on every **file** within that **folder**. 

Creating policies based on relationships rather than roles or attributes saves us from having to create authorization policies on a per-instance basis. 

  
**Resource Roles -** 

To create ReBAC policies, we need to create roles specific to a given resource. This means that the role, and the permissions it carries, are only relevant in the context of that specific resource. A resource role is formatted as **Resource#Role**.   
  
In the context of our previous example, “A **user** who is assigned the role of an **Owner** on a **folder**” will look like this: **Folder#Owner**.

The combination of Resource Roles and Role Derivations allows us to **derive** much more complex and granular roles **that are perfectly tailored to handle hierarchies**.

![ReBAC 2.png](https://media.graphassets.com/bQ4ZxwxYT0a4jaM3Obhp "ReBAC 2.png")

  
With role derivation, we can construct authorization policies that are **far more efficient for hierarchies than RBAC** and **easier to manage than with ABAC**. In **RBAC**, we would have to assign Bob a **role** that grants him direct access to each folder and file. In **ABAC**, we would add an “Owner” **attribute** to each of the files and folders and grant Bob a role that allows him to access all files and folders in which an “Owner” attribute references Bob’s ID.

Relationships are at the core of ReBAC, so let's take a closer look at what they can look like. Here are some of the most common relationship types and how they can be leveraged by ReBAC -

## Common Relationship Types

### Parent-Child Hierarchies 

A parent-child hierarchy describes the **nesting** of resources under other resources. This scenario is similar to what we know from computer file systems - Files being categorized under folders. 

In the context of ReBAC, such a relationship allows us to derive roles based on the relationship between two resources, like in the previous example: 

![ReBAC 3.png](https://media.graphassets.com/uYiTRVJT7KH9rb15wbpi "ReBAC 3.png")

The ReBAC policy for this graph will look like this: 

A **user** who is assigned the role **Folder#Owner** will also be assigned the **File#Owner** when the **Folder** instance is the **Parent** of a **FIle** instance.

In simpler words, if a file resides inside a folder (That’s the Parent-Child relationship), and a user is assigned the owner of that folder, they will also be the owner of the files. 

### Organizations

An organizational relationship allows us to create policies based on groups of users. Putting several users in one group allows us to derive policies based on their group membership, instead of per individual user. Take this example: 

![ReBAC 4.png](https://media.graphassets.com/gTrUj0fZRV6RgqdKvXYv "ReBAC 4.png")

  
Bob, Sam, and Linda are all part of the HR team. We want to grant them editing access to all files the employee data files. Instead of assigning each of them direct editor access to each file, we group them all under the HR Team. This is done via a policy like - 

A **user** who is assigned the role **HR_Group#Member** will also be assigned the **Legal_Docs#Editor** when the **HR_Group** is the **Parent** of **Legal_Docs**.

This allows us to give every user editing permissions for every file, without the need to set an explicit direct relationship between each user and each file. If we decide to add members or resources to the group, the policy's logic remains valid, and we wouldn’t have to update it for every change we make.

## How to implement ReBAC - Modeling your system:

The next section reviews a demo application simulating a healthcare provider member app and shows how you can implement it using Permit.io. Permit allows developers to implement a ReBAC model into any application by using a simple SDK and a low-code UI.  
  
You can see a working example of this healthcare demo application modeled using Permit [in this GitHub repo](https://github.com/permitio/Galactic-Health-Corporation "https://github.com/permitio/Galactic-Health-Corporation").

The first step to understanding how ReBAC should be implemented into your application is to visually map out the resources you want to manage access to via relationships. This can be done by putting all of your resources (As nodes) and the relationships between them (As edges) on a graph. This should allow you to better visualize the policies you would need to create. 

In this section, we will map out our demo application’s structure, and then display it on a graph. After that, we would be able to add actual users and instances into the mix. 

### 1. Map out our required policies

Let's take a look at the policies we will want to enforce:

- Every **app user** should be able to view all of their **own data** (health plan, Medical records, and profile data).
    
- App users should be able to see the **profiles** of **other members** in their **patient groups** (Family members, Caregivers, etc.).
    
- **Admins** should be able to **assign users** to **patient groups**.
    
- App users should be able to assign a **caregiver role** to other members of their member group, allowing them to **view their data** (health plan and medical records).
    

### 2. Mapping our Application Resources and Actions

Let’s map out all of the resources we require in our application, as well as the actions that can be performed on each resource: 

- Member (Basically a user’s member profile): View, Edit
    
- Health Plan: View
    
- Medical Records: View
    
- Patient Group: View, Assign, Unassign
    

### 3. Mapping our Resource Roles

In ReBAC, roles are not system-wide entities assigned to users (Like in RBAC). **ReBAC requires us to set up roles per resource**. This means that every single one of the resources we previously defined is going to have roles associated with it. Here are the roles we will have to associate with the resources in our demo application:

- Member: Owner (Can view and edit), Group Member (Can view), Caregiver (Can view). 
    
- Health Plan: Owner (Can view and edit), Caregiver (Can view)
    
- Medical Records: Owner (Can view and edit), Caregiver (Can view)
    
- Patient Group: Admin (Can view, assign, unassign), Group Member (Can view)
    

To set this up in Permit:

- Go to the ‘Policy Editor’ page, and click on the “Resources” tab
    
- Add our four resources, actions, and, under “ReBAC Options” - resource roles.    
      
    
    ![ReBAC 5.png](https://media.graphassets.com/ClmExeLkRpW4niWwvolJ "ReBAC 5.png")
    

- Go to the ‘Policy Editor’ tab, and check the boxes to set up the relevant permissions for each resource role.   
    
    ![ReBAC 6.png](https://media.graphassets.com/ZkBTIY5oTeOCfXa1j8TN "ReBAC 6.png")
    

### 4. Mapping our Resource Relationships

Now, it’s time to define the relationships between all of our resources. This will allow us to, later on, create authorization policies based on these relationships. 

- A member can belong to a patient group
    
- Each member has their own health plan and medical records  
      
    To set this up in Permit:
    
- Open the ‘Resources’ tab, and edit the resource to which you want to add relationships.
    
- Under “Relations”, set up the relevant relationships via the UI. 
    
    ![ReBAC 7.png](https://media.graphassets.com/a6dF66NQiCySjGqZGrnX "ReBAC 7.png")
    

### 5. Deciding on our Role Derivations

- If a **user** is the **owner** of a **member** (The member resource serving a member profile), they should have the **owner role** on their own **medical records** and **health plan** instances. 
    
- If a **user** is the **caregiver** of a **member** (Thus, they have a **caregiver role** on a member instance), they should receive a **caregiver role** on the **medical records** and **health plan** instances of the same member. 
    
- If a **user** is a **member** of a **patient group** (Thus, they have a **Group Member** role in a patient group instance), they should receive a **Group Member** role on other **member** instances belonging to the same **patient group**.   
      
    To set this up in Permit:
    
- Open the ‘Roles’ tab, and open the role you want to add derivations to. 
    
- Under ‘ReBAC Options’,  set up the required derivation via the UI: 
    
    ![ReBAC 8.png](https://media.graphassets.com/qMetQVkSTK6baZjJwb8x "ReBAC 8.png")
    

Now let’s see how everything we set up would look on a graph: 

![ReBAC 9.png](https://media.graphassets.com/XPu3LMZLSrWFgKMvG9u9 "ReBAC 9.png")

  
  
Now that we have our system model set up, we can continue to discuss how this model can be implemented in a real application.

## How to implement ReBAC - Real-world example

Let’s take everything we set up in the previous stage of modeling our system and apply it to a real-world scenario with two actual users - Sam and Bob.

![ReBAC 10.png](https://media.graphassets.com/FGUeloDNQg6Iu3WQ0MI9 "ReBAC 10.png")

  
Let’s break this apart and see what’s going on here.   
  
Let’s first look at the direct relationships (In black) and role assignments (In green): 

1. We have one **Patient Group** instance, with Bob as an **Admin** and Sam as a **Group Member**. 
    
2. We have two **Member Profile** instances that belong to the same **Patient Group**. Bob and Sam each have an **Owner** role assignment to **their own Member Profile** instances. 
    
3. Bob is assigned as a **Caregiver** to Sam’s **Member Profile** instance. 
    
4. Each **Member Profile** instance is a parent of two resource instances: **Medical Plan** and **Medical Record**.
    

Now, let’s look at our role derivations: 

1. Sam has a **Group Member** role on Bob’s **Member Profile** instance, derived from his **Group Member** role assignment on the Smith Family **Patient Group**. This allows Sam to view Bob’s Member details. 
    
2. Both Sam and Bob have an **Owner** role on their **Medical Plan** and **Medical Records**. This is derived from their **Owner** role assignment of their **Member Profile** instances. 
    
3. Bob has a **Caregiver** role on Sam’s **Medical Plan** and **Medical Records**. This is derived from his **Caregiver** role on Sam’s **Member Profile** instance. 
    

Using Permit’s APIs, with functions such as [sync_user](https://api.permit.io/v2/redoc#tag/Users/operation/update_user "https://api.permit.io/v2/redoc#tag/Users/operation/update_user"), , and [assign_role](https://api.permit.io/v2/redoc#tag/Role-Assignments/operation/assign_role "https://api.permit.io/v2/redoc#tag/Role-Assignments/operation/assign_role"), you can easily reproduce this policy structure in a real-life application without the hassle of modeling everything yourself from scratch. Using Permit’s [SDKs](https://docs.permit.io/category/sdk "https://docs.permit.io/category/sdk") also saves you the time of coding the API calls yourself.

```php
await permit.api.roleAssignments.assign({
      user: sam,
      role: 'group_member',
      resource_instance: `patient_group:bobs_group`,
      tenant: 'default',
  });
```

```php
await permit.api.relationshipTuples.create({
      subject: `patient_group:bobs_group`,
      relation: 'belongs',
      object: `member:sam`,
      tenant: 'default',
  });
```

_An example of using Permit’s NodeJS SDK - Assigning Sam the role of “Group Member” in Bob’s patient group and creating a Relationship Tupple between Bob’s Group and Sam’s Member Profile._ 

## ReBAC Pros and Cons

Now that we have discussed implementation, let’s do a quick review of the pros and cons of choosing ReBAC as your policy model:

### ReBAC Pros

- **Handling Complex Hierarchies**: ReBAC is designed to represent hierarchies and nested relationships, making it the most suitable choice for managing permissions for complex hierarchical relationships. 
    
- **Enables reverse indices**: ReBAC’s graph structure allows for reverse queries (not only does x have access to y, but also who has access to y).
    
- Using ReBAC allows us to **define permissions en masse** instead of doing it individually for every single resource by using teams and groups. 
    
- **RBAC alternative**: The combined use of relationships together with roles is a good way to avoid RBAC role explosion (in which, for the sake of granularity, many roles are created, making it extremely hard to manage / audit)
    

### ReBAC Cons

- **Complexity:** Implementing, managing, and maintaining ReBAC by yourself can be complex and time-consuming.
    
- **Resource-intensive:** ReBAC's consideration of numerous attributes can require significant processing power and time.
    
- **Difficult to audit:** The complexity and recursive nature of ReBAC policies can make auditing challenging.
    
- **Not a replacement for ABAC:** Though much more granular than RBAC, ReBAC still struggles with truly fine-grained, or dynamic permissions - such as rules dependent on attributes like time, location, quotas, etc.
    

## Scalable Implementation

As application requirements evolve, the need to shift from simple authorization models to RBAC, ABAC, or ReBAC can arise rapidly. Implementing and managing such complex authorization systems can be challenging for developers and other stakeholders, potentially leading to bottlenecks and inflexibility.

Setting up a system as complex as ReBAC could take months of work, which doesn’t end at the point of implementation - as creating additional roles, attributes, and policies requires complex R&D work and steep learning curves.