# StoryViz

## Execution

- Activate virtual environment
  ```
  pipenv shell
  ```
- Execute main program
  ```
  python ./src/run.py
  ```

## Commands
- Delete all collections (Inside firebase directory)
  ```
  firebase firestore:delete --all-collections
  ```
- Delete all collections (Any directory)
  ```
  firebase firestore:delete --all-collections --project storyviz-col
  ```

### Reference

- Firestore: https://firebase.google.com/docs/firestore/
- Python Firestore: https://googleapis.github.io/google-cloud-python/latest/firestore/index.html
- Firebase CLI: https://firebase.google.com/docs/cli/
