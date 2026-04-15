from github import Github
import os
import shutil

class GitHubService:
    def __init__(self, token: str):
        self.gh = Github(token)
        self.user = self.gh.get_user()

    async def create_and_push_repo(self, repo_name: str, folder_path: str, readme_content: str, workflow_config: dict):
        """Create a repository and push local content with AI README."""
        
        # 1. Create Repo
        repo = self.user.create_repo(
            repo_name,
            private=True,
            license_template=workflow_config.get("license_type", "mit")
        )

        # 2. Add README
        repo.create_file("README.md", "Initial commit with AI content", readme_content)

        # 3. Add Folder Structure & Files (SIMPLIFIED for MVP)
        # In a real app, we would walk the local folder and add all files
        # repo.create_file(path, message, content)

        # 4. Set Branch Protection
        if workflow_config.get("branch_protection"):
            branch = repo.get_branch("main")
            branch.edit_protection(
                strict=True,
                enforce_admins=True,
                required_approving_review_count=1
            )

        # 5. Add Collaborators
        for username in workflow_config.get("collaborators", []):
            try:
                repo.add_to_collaborators(username, permission="push")
            except:
                pass

        return repo.html_url
