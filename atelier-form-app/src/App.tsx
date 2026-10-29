import { FormProvider, useForm } from './context/FormContext';
import { CommissionFormPage } from './pages/CommissionFormPage';
import { ConfirmationPage } from './pages/ConfirmationPage';

function AppContent() {
  const { state } = useForm();

  if (state.status === 'submitted') {
    return <ConfirmationPage />;
  }

  return <CommissionFormPage />;
}

export default function App() {
  return (
    <FormProvider>
      <AppContent />
    </FormProvider>
  );
}
