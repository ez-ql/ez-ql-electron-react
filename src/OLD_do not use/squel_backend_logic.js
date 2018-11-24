loadPreview = () => {
  //TODO Build squel query based on currQuer in global obj
  //will include any aggregates if there are any
  const basicQuery = squel
    .select()
    .from(sharedObj.currQuery.from)
    .fields(sharedObj.currQuery.fields);

  //TODO add join logic
  // if (sharedObj.joinType) {
  //   switch (
  //     sharedObj.joinType
  //     // case left_join:
  //   basicQuery.left_join;
  //   break;
  // case right_join:
  //   break;
  // case inner_join:
  //   break;
  // case outer_join:
  //   break;
  //   ) {
  //   }
  // }

  //TODO add filter logic
  this.setState({ sql: basicQuery.toString() });
  ipcRenderer.send("async-new-table-preview-query", basicQuery.toString());
};
