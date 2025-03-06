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
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export const WaitAlertModal = ({
  openModal,
  pagoparToken,
  setOpenModal,
}: WaitAlertModalProps) => {
  return (
    <AlertDialog open={openModal} onOpenChange={setOpenModal}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Let's go to checkout</AlertDialogTitle>
          <AlertDialogDescription>
            This window will close automatically when the payment is confirmed.
            <br />
            If the payment is not confirmed, the selected coordinates will be
            locked for 7 minutes before you can retry.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <button
          className="mt-2 bg-lime-600 hover:bg-lime-700 text-white font-bold py-2 px-4 rounded-md transition-colors"
          onClick={() =>
            window.open(
              `https://www.pagopar.com/pagos/${pagoparToken}?forma_pago=9`,
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
