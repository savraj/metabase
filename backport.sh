git reset HEAD~1
rm ./backport.sh
git cherry-pick 6afcf2aed58288ca85d3b7d84d545760ea293648
echo 'Resolve conflicts and force push this branch.\n\nTo backport translations run: bin/i18n/merge-translations <release-branch>'
