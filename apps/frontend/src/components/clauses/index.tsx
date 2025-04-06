import * as Dialog from '@radix-ui/react-dialog';
import { Fragment } from 'react/jsx-runtime';
import { useClauses } from '../../context/ClausesContext';

export const Clauses = () => {
  const {
    availableClauses,
    selectedClauses,
    addClause,
    removeClause,
    isAddClauseDialogOpen,
    setAddClauseDialogOpen,
    setInsertPosition,
  } = useClauses();

  return (
    <div className="h-full flex flex-col text-white">
      <h1 className="text-3xl mb-6 text-white font-light">Clauses</h1>

      <div className="flex flex-col gap-y-2 flex-1 bg-[#2c3e5d] p-2">
        <button
          className="text-xs self-center space-x-2 w-fit rounded-xl flex items-center justify-center bg-[#1a2841] text-[#e0c99b] py-1 px-4"
          onClick={() => {
            setInsertPosition(0);
            setAddClauseDialogOpen(true);
          }}
        >
          <span>+</span>
          <span>Add Clause</span>
        </button>

        {selectedClauses.map((clause, index) => (
          <Fragment key={`clause-group-${index}`}>
            <div className="bg-[#1a2841] flex items-center justify-between rounded p-2">
              <span>{clause.title}</span>
              <div className="flex items-center gap-x-2 text-[#e0c99b]">
                <button>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2"
                    />
                  </svg>
                </button>
                <button onClick={() => removeClause(index)}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <button
              className="text-xs self-center space-x-2 w-fit rounded-xl flex items-center justify-center bg-[#1a2841] text-[#e0c99b] py-1 px-4 my-1"
              onClick={() => {
                setInsertPosition(index + 1);
                setAddClauseDialogOpen(true);
              }}
            >
              <span>+</span>
              <span>Add Clause</span>
            </button>
          </Fragment>
        ))}
      </div>

      <Dialog.Root
        open={isAddClauseDialogOpen}
        onOpenChange={setAddClauseDialogOpen}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#1a2841] text-white rounded-lg p-6 w-full max-w-3xl max-h-[85vh] overflow-y-auto">
            <Dialog.Title className="text-xl mb-4 text-[#e0c99b]">
              Add New Clause
            </Dialog.Title>

            <div className="mb-4">
              <input
                type="text"
                placeholder="Search"
                className="w-full bg-[#2c3e5d] text-white border-none rounded p-2 focus:outline-none"
              />
            </div>

            <div className="space-y-2 max-h-[60vh] overflow-y-auto">
              {availableClauses.map((clause) => (
                <div
                  key={clause.id}
                  className="bg-[#2c3e5d] p-3 rounded flex justify-between items-center"
                >
                  <span>{clause.title}</span>
                  <button
                    className="bg-[#1a2841] text-[#e0c99b] px-3 py-1 rounded"
                    onClick={() => {
                      addClause(clause);
                      setAddClauseDialogOpen(false);
                    }}
                  >
                    + Add
                  </button>
                </div>
              ))}
            </div>

            <Dialog.Close asChild>
              <button
                className="absolute top-4 right-4 text-[#e0c99b]"
                aria-label="Close"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};
