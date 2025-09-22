git reset HEAD~1
rm ./backport.sh
git cherry-pick fa187a027dc96e84cc3f8792ff0bababd15f69b6
echo 'Resolve conflicts and force push this branch.\n\nTo backport translations run: bin/i18n/merge-translations <release-branch>'
