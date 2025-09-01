import {
  AlertDialog,
  AlertDialogTitle,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";

interface WaitAlertModalProps {
  openModal: boolean;
  pagoparToken: string;
  codeReferShow: string;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export const WaitAlertModal = ({
  openModal,
  pagoparToken,
  codeReferShow,
  setOpenModal,
}: WaitAlertModalProps) => {
  return (
    <AlertDialog open={openModal} onOpenChange={setOpenModal}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Let's go to checkout</AlertDialogTitle>
          <AlertDialogDescription className="flex flex-col">
            {/* <p>
              By sending this code to someone else, both of you will earn an
              extra point for the upcoming raffle!
            </p>
            <div className="h-14 my-4 m-auto border border-1 w-52 border-slate-300 rounded-md p-2 flex items-center justify-center">
              <h2 className="font-bold text-2xl">{codeReferShow}</h2>
            </div> */}
            <p>
              This window will close automatically when the payment is
              confirmed.
            </p>
            <br />
            <p>
              If the payment is not confirmed, the selected coordinates will be
              locked for 7 minutes before you can retry.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <button
          className="mt-2 bg-lime-600 hover:bg-lime-700 text-white font-bold py-2 px-4 rounded-md transition-colors"
          onClick={() =>
            window.open(
              `https://www.pagopar.com/pagos/${pagoparToken}?forma_pago=26`,
              "_blank"
            )
          }
        >
          Pay C:
        </button>
      </AlertDialogContent>
    </AlertDialog>
  );
};
