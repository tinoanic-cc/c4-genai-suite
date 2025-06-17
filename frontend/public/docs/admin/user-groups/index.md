# The Groups Page

## System Defaults

The system defaults do not come with any restrictions apart from differentiating between administrators and normal (default) [users](/admin/users). Also restrictions cannot be edited for these default groups.

## Custom Groups

Use the **"Create User Group"** button to generate a custom group. All custom groups are regular users without administrator permissions.

### The main features of custom groups:
- Sorting users with the option to add restrictions later.
- **Cost control**: Limit the tokens a group as a whole, or single users may utilize in a month. Find the cost associated with the number of utilized tokens on the page of your LLM API provider, such as Azure.
- Assign [Assistants](/admin/assistants) to groups, to keep different configurations based on the need of different user groups.

### Example custom groups:
- a group named "project-x", which may or may not have a limit. Such a group could help to restrict the costs associated with "project-x" in your company.
- a group named "inactive", with a token limit of 1, such that the users in group "inactive" can not cause any additional costs.
- a group named "technical", if you want to use it for all the technical users, which provide API-Keys. This way you may limit the tokens and cost caused by automated requests via an API-Key.
