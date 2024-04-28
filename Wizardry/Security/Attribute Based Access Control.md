Attribute-based access control (ABAC) is an authorization model that evaluates attributes (or characteristics), rather than roles, to determine access. The purpose of ABAC is to protect objects such as data, network devices, and IT resources from unauthorized users and actions—those that don’t have “approved” characteristics as defined by an organization’s security policies.

ABAC as a form of logical [access control](https://www.okta.com/identity-101/access-control/) became prominent in the past decade, having evolved from simple access control lists and [[Wizardry/Security/role-based access control|role-based access control]]. As part of an initiative to help federal organizations improve their access control architectures, the Federal Chief Information Officers Council endorsed ABAC in 2011. They recommended ABAC as the model to adopt for organizations to safely share information.

In this post, we explore how attribute-based access control works in greater depth and consider the ways that adopting ABAC could benefit your organization.

## What are the main components of attribute-based access control?

With ABAC, an organization’s access policies enforce access decisions based on the attributes of the subject, resource, action, and environment involved in an access event. 

### Subject

The **subject** is the user requesting access to a resource to perform an action. Subject attributes in a user profile include ID, job roles, group memberships, departmental and organizational memberships, management level, security clearance, and other identifying criteria. ABAC systems often obtain this data from an HR system or directory, or otherwise collect this information from authentication tokens used during login.

### Resource

The **resource** is the asset or object (such as a file, application, server, or even [API](https://www.okta.com/blog/2020/10/api-application-programming-interface/)) that the subject wants to access. Resource attributes are all identifying characteristics, like a file’s creation date, its owner, file name and type, and data sensitivity. For example, when trying to access your online bank account, the resource involved would be “bank account = <correct account number>.”

### Action

The **action** is what the user is trying to do with the resource. Common action attributes include “read,” “write,” “edit,” “copy,” and “delete.” In some cases, multiple attributes can describe an action. To continue with the online banking example, requesting a transfer may have the characteristics “action type = transfer” and “amount = $200.”

### Environment

The **environment** is the broader context of each access request. All environmental attributes speak to contextual factors like the time and location of an access attempt, the subject’s device, communication protocol, and encryption strength. Contextual information can also include risk signals that the organization has established, such as authentication strength and the subject’s normal behavior patterns.

## How does ABAC use attributes to express access control policies?

Attributes are the characteristics or values of a component involved in an access event. Attribute-based access control analyzes the attributes of these components against rules. These rules define which attribute combinations are authorized in order for the subject to successfully perform an action with the object.

Based on how attributes interact in an environment, every ABAC solution can evaluate them within an environment, and enforce rules and relationships. Policies take attributes into account to define which access conditions are allowed or not.

For example, let’s say that the following policy is in place:

“If the subject is in a communications job role, they should have read and edit access to media strategies for the business units they represent.”

Whenever an access request happens, the ABAC system analyzes attribute values for matches with established policies. As long as the above policy is in place, an access request with the following attributes should grant access:

- Subject’s “job role” = “communications”
- Subject’s “business unit” = “marketing”
- Action = “edit”
- Resource “type” = “media strategy document”
- Resource “business unit” = “marketing”

In effect, ABAC allows admins to implement granular, policy-based access control, using different combinations of attributes to create conditions of access that are as specific or broad as the situation calls for.

## What are the pros of ABAC?

Now that you know what ABAC is and how it works, let’s examine how it keeps businesses agile and secure. There are three main benefits of attribute-based access control:

### Granular yet flexible policy-making

The key benefit of ABAC is its flexibility. Essentially, the limit for policy-making lies in what attributes must be accounted for, and the conditions the computational language can express. ABAC allows for the greatest breadth of subjects to access the greatest amount of resources without requiring admins to specify relationships between each subject and object. Take the following steps as an example:

1. When a subject joins an organization, they’re assigned a set of subject attributes (e.g., John Doe is a consultant for the radiology department).
2. An object, when created, is assigned its attributes (e.g., a folder with cardiac imaging test files for heart patients).
3. The admin or object owner then creates an access control rule (e.g., “All consultants for the radiology department can view and share cardiac imaging test files for heart patients”).

Admins can further modify these attributes and access control rules to fit the needs of an organization. For instance, when defining new access policies for external subjects like contractors and providers, they can do so without manually changing each subject-object relationship. ABAC allows for a wide variety of access situations with little administrative oversight.

### Compatibility with new users

With ABAC, admins and object owners can create policies allowing new subjects to access resources. As long as new subjects are assigned the needed attributes to access the objects (e.g., all consultants for the radiology department are assigned those attributes), there’s no need to modify existing rules or object attributes.

ABAC models allow organizations to be nimble when [onboarding new staff](https://www.okta.com/products/lifecycle-management/) and enabling  external partners.

### Stringent security and privacy

Through its use of attributes, ABAC lets policy-makers control many situational variables, securing access on a fine-grained basis. In a RBAC model, for example, HR teams may always have access to sensitive employee information, such as payroll data and personally identifiable information. With ABAC, admins can implement smart access restrictions that account for context—for instance, HR employees may only have access to this information at certain times or only for staff in the relevant branch office.

As a result, ABAC lets organizations effectively close security gaps and honor employee privacy, while efficiently following regulatory compliance requirements.

## What are the cons of ABAC?

When it comes to ABAC, the benefits far outweigh the costs. But there is one drawback businesses should keep in mind before implementing attribute-based access control: _implementation complexity_. 

### Complex to design and implement

ABAC can be difficult to get off the ground. Admins need to manually define attributes, assign them to every component, and create a central policy engine that determines what attributes are allowed to do, based on various conditions (“if X, then Y”). The model’s focus on attributes also makes it hard to gauge the permissions available to specific users before all attributes and rules are in place.

However, while implementing ABAC can take considerable time and resources, the effort does pay off. Admins can copy and reuse attributes for similar components and user positions, and ABAC’s adaptability means that maintaining policies for new users and access situations is a relatively “hands-off” affair.

## What is the right access control model for my organization?

The size of your organization is a crucial factor here. Thanks to ABAC’s initial difficulty to design and implement, it may be too complicated for small businesses to consider.

For small- and medium-sized enterprises, RBAC is a simpler alternative to ABAC. Each user is assigned a unique role, with corresponding permissions and restrictions. When a user moves to a new role, their permissions change to that of the new position. This means, in hierarchies where roles are clearly defined, it’s easy to manage a small number of internal and external users.

However, when new roles must be built manually, it’s not efficient for larger organizations. Once attributes and rules are defined, ABAC’s policies are much easier to apply when users and stakeholders are numerous, while also reducing security risks.

In short, choose ABAC if:

- You’re in a large organization with many users
- You want deep, specific access control capabilities
- You have time to invest in a model that goes the distance
- You need to ensure privacy and security compliance

But, consider RBAC if:

- You’re in a small- to medium-sized enterprise
- Your access control policies are broad 
- You have few external users, and your organization roles are clearly defined