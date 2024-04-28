Role-based access control (RBAC) systems **assign access and actions according to a person's role** within the system. Everyone who holds that role has the same set of rights. Those who hold different roles have different rights.

## Why Does a System Need RBAC?

Every company has sensitive documents, programs, and records. Protect them too strictly, and your company's work grinds to a halt. Leave them open, and catastrophic security issues can arise. 

Enter role-based access control (RBAC).

Use this method to grant access to those who need it while blocking those who don't need access. Make changes based on a person's role rather than individual attributes. You can make these changes quickly by altering access by role.

If you work in IT, understanding the ins and outs of role-based [access control](https://www.okta.com/identity-101/access-control/) is critical. In 2004, the American National Standards Institute [adopted RBAC principles as an industry consensus standard](https://csrc.nist.gov/Projects/Role-Based-Access-Control/faqs). Chances are, you'll either need to apply RBAC or explain why you think it's a bad idea for your company.

![Role-Based Access Control](https://www.okta.com/sites/default/files/styles/tinypng/public/media/image/2020-10/Role-Based-Access-Control-Graphic.png?itok=lroEbU_0)

## What Exactly Is Role-Based Access Control?

All role-based access control systems share core elements, such as:

- **Administrators.** They identify roles, grant permissions, and otherwise maintain security systems.
- **Roles.** Workers are grouped together based on the tasks they perform.
- **Permissions.** Access and actions attach to each role, and they outline what people can and cannot do.

RBAC systems do not require:

- **Differentiation of individual freedoms.** Access is defined by a person's role, not that person's preferences or wishes. This makes it easy to manage permissions.
- **Intensive maintenance.** Permissions follow roles. A new job function becomes a new role applied to dozens (or hundreds or thousands) of employees with only a small amount of work for the administrator. Promotions involve changing roles, not editing permissions as line items.

RBAC systems have been around for decades. In 1992, [RBAC concepts were introduced](https://csrc.nist.gov/publications/detail/conference-paper/1992/10/13/role-based-access-controls) in a national computer security conference. The originators felt that mandatory access controls and discretionary access controls just didn't work well for private companies and civilians because specific needs and security requirements varied so much. The new method, they argued, worked better in non-military, civilian settings. 

Since then, thousands of companies have applied RBAC concepts to manage security for their most sensitive documents. 

## How Do Roles Work Within RBAC?

Roles dictate [authorization](https://www.okta.com/identity-101/authentication-vs-authorization/) within an RBAC system. It's critical to define them properly. Otherwise, large groups of people within your company can't do their work. 

Roles can be defined by:

- **Authority.** Senior management needs access to files interns should never see.
- **Responsibility.** A board member and a CEO might hold similar authority within a company, but they are each responsible for different core functions.
- **Competence.** A skilled worker can be trusted to work within sensitive documents without errors, while a novice could make catastrophic mistakes. It’s important to tailor access accordingly.

Roles can also have overlapping responsibilities and privileges. For example, someone with the role "surgeon" might also work as a "doctor" or "radiograph interpreter." A [role hierarchy](https://spaf.cerias.purdue.edu/classes/CS526/role.html) defines one type of person who holds the attributes of many other people. In other words, one role can hold many others inside it. 

## What Are Role-Based Access Control Permissions?

Permissions specify what people can access and what they can do in the system. Think of permissions as the [rules people follow](https://medium.com/@adriennedomingus/role-based-access-control-rbac-permissions-vs-roles-55f1f0051468) per the roles you have outlined.

Your permissions should involve:

- **Access.** Who can open a specific drive, program, file, or record? Who shouldn't even know these things exist? Access will limit what people can see.
- **Reading.** Who can scan through these documents, even if they can't change anything inside of them? Some roles may have the ability to reference materials but not make changes to them.
- **Writing.** Who can change documents? Does someone else have to approve the changes, or are they permanent? You’ll define this with your permissions.
- **Sharing.** Who can download a document or send it as an email attachment? As with the other permissions, some users will not be able to share materials even if they can reference them.
- **Finances.** Who can charge money? Who can offer refunds? Permissions could involve the ability to deal with charges and refunds, set up credit accounts, or cancel payments.

It's critical to remember that permissions follow roles, not the other way around. Determine what each role should do, and apply permissions accordingly.

Don't allow employees to demand permissions despite the limitations of their current role. If you begin to alter permissions on an individual basis, the system can quickly get unwieldy. 

## Role-Based Access Control Benefits

Security options abound, and it's not always easy to make the right choice for your company. RBAC comes with plenty of tried-and-true benefits that set it apart from the competition.

An RBAC system can:

- **Reduce complexity.** New employees gain access based on their roles, not on long lists of server and document requirements. This simplifies creating, maintaining, and auditing policies
- **Allow global administration.** Change access for many employees all at once by altering permissions associated with a role. 
- **Ease onboarding**. As people join, move within, or are promoted within your organization, you don’t have to worry about the individual’s permissions, just that they’re in the right place. The roles take care of the rest.
- **Reduce blunders.** Traditional security administration is [error-prone](https://csrc.nist.gov/projects/role-based-access-control). Adding permissions for individuals gives you plenty of options to make a mistake. Change a role’s access, and you're less likely to give someone too much (or too little) power.
- **Lower overall costs.** When admin duties shrink, companies [save on security administration](https://csrc.nist.gov/CSRC/media/Presentations/Role-Based-Access-Control-(RBAC)-Presentation/images-media/rbac-slides-doe.pdf). This saves your organization time and money. 

## RBAC vs. ABAC: Which Is Better?

Before we dig into the nitty-gritty of applying a role-based access control model, let's discuss an alternative. ABAC is one of the best-known models companies consider, and it could be useful in some settings.

[ABAC, or attribute-based access control](https://www.okta.com/identity-101/role-based-access-control-vs-attribute-based-access-control/), explodes your role options. Rather than considering job titles, seniority, and similar attributes, you could consider:

- **User types.** Security clearances, financial knowledge, or citizen status could all play a role in the roles you create.
- **Time of day.** Lock down documents during the night when meaningful work should cease. Limit edits during times when supervisors aren't available. Restrict access to materials on weekends.
- **Location.** Ensure that documents are only accessed on campus or stateside, for example. Restrict user ability to access documents from home, if appropriate.

A system like this leans on policies to enforce security rather than static permission types. Getting the balance right is slightly more difficult, as more variables are involved. Depending on your security environment, it could be a smart choice for your organization.

## How to Implement an RBAC System

Like most security tasks, crafting a role-based access control system is a methodical process. Each step must be completed in order. You may need quite a bit of input to do the job right.

To create the right system, you must:

- **Inventory your system.** Determine the programs, servers, documents, files, and records that are part of your business landscape. Take some time to think this through, as you don’t want to leave anything out.
- **Identify roles.** Collaborate with management and human resources. Determine how many roles make sense for your company, and identify permissions based on those roles.
- **Develop an integration timeline.** Determine how long you will need to put your program to work, and give your colleagues time to prepare. Don't roll out your changes without notifying workers, or you could grind progress to a halt.
- **Remain open to feedback.** Circulate your plans for roles and permissions. Ask managers if your assumptions are correct, and make adjustments accordingly.

There is some trial and error involved in the setup process. Don’t be afraid to circle back if something isn’t working as planned.

- **Implement the plan.** With roles and permissions identified, put the plan to work. Watch the network closely and fix glitches if they appear.

Follow a few best practices to ensure your project's success.

- **Take your time.** Even tiny companies have hundreds of role/permission combinations. Plan very carefully and give yourself time to adjust your plans before you put them to work.
- **Stand firm.** Chances are, users will come to you and ask for permissions outside of their roles. Consider each request carefully before giving individual users additional permissions.

Take note of these requests, and ask management if everyone in the role should have access to the requested files. You want to avoid users who hold the same roles having drastically different levels of access.

- **Collaborate often.** [Too-tight security rules](https://dl.acm.org/doi/10.1145/3102304.3109817) lead to systems that aren't useful for end users. Don't deny requests without thorough investigation and collaboration. Strike a balance to keep the company working safely.

## References

[Role Based Access Control (RBAC)](https://csrc.nist.gov/Projects/Role-Based-Access-Control/faqs). (June 2020). National Institute of Standards and Technology, U.S. Department of Commerce. 

[Conference Proceedings: Role-Based Access Controls](https://csrc.nist.gov/publications/detail/conference-paper/1992/10/13/role-based-access-controls). (November 1992). National Institute of Standards and Technology, U.S. Department of Commerce.

[An Introduction to Role-Based Access Control](https://spaf.cerias.purdue.edu/classes/CS526/role.html). (December 1995). National Institute of Standards and Technology, U.S. Department of Commerce.

[Role-Based Access Control (RBAC): Permissions vs. Roles](https://medium.com/@adriennedomingus/role-based-access-control-rbac-permissions-vs-roles-55f1f0051468). (February 2018). Medium. 

[Role-Based Access Control Project Overview](https://csrc.nist.gov/projects/role-based-access-control). (June 2020). National Institute of Standards and Technology, U.S. Department of Commerce.

[Role-Based Access Control (Presentation)](https://csrc.nist.gov/CSRC/media/Presentations/Role-Based-Access-Control-(RBAC)-Presentation/images-media/rbac-slides-doe.pdf). National Institute of Standards and Technology. 

[An Evolution of Role-Based Access Control Towards Easier Management Compared to Tight Security](https://dl.acm.org/doi/10.1145/3102304.3109817). (July 2017). _ICFNDS '17: Proceedings of the International Conference on Future Networks and Distributed Systems_.

[Authorization and Access Control](https://www.sciencedirect.com/science/article/pii/B9780128007440000038). (2014). _The Basics of Information Security (Second Edition)_.

[Security for Distributed Systems: Foundations of Access Control](https://www.sciencedirect.com/science/article/pii/B9780123735669500057). (2008). _Information Assurance: Dependability and Security in Networked Systems_.

[Access Controls](https://www.sciencedirect.com/science/article/pii/B9780128038437000776). (2013). _Computer and Information Security Handbook (Third Edition)_.

[How to Implement Role-Based Access Control](https://www.computerweekly.com/news/2240083532/How-to-implement-role-based-access-control). (October 2007). Computer Weekly.

[Role-Based Access Control: Meek or Monster. Wired.](https://www.wired.com/insights/2013/08/role-based-access-control-meek-or-monster/)

[Guide to Role-Based Access Control (RBAC)](https://www.ibm.com/support/pages/guide-role-based-access-control-rbac). IBM Support.

[Extending RBAC for Large Enterprises and Its Quantitative Risk Evaluation](https://link.springer.com/content/pdf/10.1007%2F978-0-387-85691-9_9.pdf). Mitsubishi Electric Corporation.

[Restricting Database Access Using Role-Based Access Control (Built-In Roles)](https://docs.aws.amazon.com/documentdb/latest/developerguide/role_based_access_control.html). Amazon Web Services (AWS).

[An Enhancement of the Role-Based Access Control Model to Facilitate Information Access Management in Context of Team Collaboration and Workflow](https://www.sciencedirect.com/science/article/pii/S1532046412000913). (December 2012). _Journal of Biomedical Informatics_.

[Identify Governance and Role-Based Access Control](https://its.umich.edu/accounts-access/identity-governance/role-based-access-control). University of Michigan Information and Technology Services.