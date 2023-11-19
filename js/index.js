const resourceName = {
  0: "",
  1: "resourceA",
  2: "resourceB"
};
const styleClassMapping = {
  1: "cell-t1",
  2: "cell-t2"
};
function getOperationString(operation, resource) {
  switch(operation) {
    case "r":
      return "READ ";
    case "w":
      return "WRITE ";
    case "c":
      return "COMMIT ";
    case "a":
      return "ABORT ";
  }

  throw new Error("undefined operation code");
}
const mainTable = document.getElementById("main-tab");
function mapArrayToTable(operations) {
  // faster than innerHTML = '' since no call to HTML parser??
  while(mainTable.lastElementChild) {
    mainTable.removeChild(mainTable.lastElementChild);
  }

  for (let item of operations) {
    // example { transaction: 1, operation: "r" }
    if (item.transaction === 1) {
      mainTable.innerHTML += `<tr>
                    <td class="${styleClassMapping[item.transaction]}">
                      <strong>${getOperationString(item.operation)}</strong> ${resourceName[item.resource]}
                    </td>
                    <td></td>
                  </tr>`;
    }
    else if (item.transaction === 2) {
      mainTable.innerHTML += `<tr>
                    <td></td>
                    <td class="${styleClassMapping[item.transaction]}">
                    <strong>${getOperationString(item.operation)}</strong> ${resourceName[item.resource]}
                    </td>
                  </tr>`;
    }
  }
}
const buttonSerial = document.getElementById("ser"),
      buttonSerialReversed = document.getElementById("inter"),
      buttonSerializable = document.getElementById("nser-seri"),
      buttonNonSerializable = document.getElementById("nser-nseri"),
      description = document.getElementById("description"),
      buttonNonSerializableRecoverable = document.getElementById("inter-nseri-reco"),
      buttonNonSerializableNonRecoverable = document.getElementById("inter-nseri-nreco");
buttonSerial.onclick = function() {
  const schedule = [
    { transaction: 1, operation: "r", resource: 1 },
    { transaction: 1, operation: "r", resource: 2 },
    { transaction: 1, operation: "w", resource: 2 },
    { transaction: 1, operation: "c", resource: 0 },
    { transaction: 2, operation: "r", resource: 2 },
    { transaction: 2, operation: "r", resource: 1 },
    { transaction: 2, operation: "w", resource: 1 },
    { transaction: 2, operation: "c", resource: 0 }
  ];

  description.innerHTML = "a transaction is executed completely before starting the execution of another transaction";

  mapArrayToTable(schedule);
};
buttonSerializable.onclick = function() {
  const schedule = [
    { transaction: 1, operation: "r", resource: 1 },
    { transaction: 2, operation: "r", resource: 1 },
    { transaction: 1, operation: "r", resource: 2 },
    { transaction: 2, operation: "r", resource: 2 },
    { transaction: 1, operation: "w", resource: 2 },
    { transaction: 2, operation: "w", resource: 1 },
    { transaction: 1, operation: "c", resource: 0 },
    { transaction: 2, operation: "c", resource: 0 }
  ];

  description.innerHTML = "An equivalence to the serial schedules(the serial one).";

  mapArrayToTable(schedule); 
};
buttonNonSerializable.onclick = function() {
  const schedule = [
    { transaction: 1, operation: "r", resource: 1 },
    { transaction: 2, operation: "r", resource: 1 },
    { transaction: 1, operation: "r", resource: 2 },
    { transaction: 1, operation: "w", resource: 2 },
    { transaction: 2, operation: "r", resource: 2 },
    { transaction: 2, operation: "w", resource: 1 },
    { transaction: 2, operation: "c", resource: 0 },
    { transaction: 1, operation: "c", resource: 0 }
  ];

  description.innerHTML = "The order of READ and WRITE for ResourceB has been changed compare to the serializable one.";

  mapArrayToTable(schedule); 
};
buttonNonSerializableRecoverable.onclick = function() {
  const schedule = [
    { transaction: 1, operation: "r", resource: 1 },
    { transaction: 1, operation: "w", resource: 1 },
    { transaction: 2, operation: "r", resource: 2 },
    { transaction: 2, operation: "r", resource: 1 },
    { transaction: 1, operation: "c", resource: 0 },
    { transaction: 2, operation: "w", resource: 1 },
    { transaction: 1, operation: "c", resource: 0 },
  ];

  description.innerHTML = " To be recoverable, transactions must commit only after all transactions whose changes they read commit.";

  mapArrayToTable(schedule); 
};
buttonNonSerializableNonRecoverable.onclick = function() {
  const schedule = [
    { transaction: 1, operation: "r", resource: 2 },
    { transaction: 1, operation: "w", resource: 1 },
    { transaction: 2, operation: "r", resource: 1 },
    { transaction: 1, operation: "a", resource: 0 },
    { transaction: 2, operation: "r", resource: 1 },
    { transaction: 2, operation: "w", resource: 1 },
    { transaction: 1, operation: "c", resource: 0 },
  ];

  description.innerHTML = "ABORT before after other transaction read changes and before other transaction to commit, bring to an Inconsistency.";

  mapArrayToTable(schedule); 
};
