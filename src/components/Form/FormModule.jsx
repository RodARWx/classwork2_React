import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFormik } from 'formik';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  RotateCcw,
  Send,
  ShieldCheck,
} from 'lucide-react';
import {
  EXPERIENCE_OPTIONS,
  INITIAL_FORM_VALUES,
  ROLE_OPTIONS,
  SKILL_OPTIONS,
  formSchema,
} from './formSchema';
import './FormModule.css';

function FieldError({ message }) {
  return (
    <AnimatePresence mode="wait">
      {message && (
        <motion.span
          className="error-text"
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.18 }}
        >
          <AlertCircle size={14} />
          {message}
        </motion.span>
      )}
    </AnimatePresence>
  );
}

function validateWithZod(values) {
  const result = formSchema.safeParse(values);
  if (result.success) return {};
  const errors = {};
  for (const issue of result.error.issues) {
    const key = issue.path[0];
    if (key && !errors[key]) {
      errors[key] = issue.message;
    }
  }
  return errors;
}

function countValidFields(values) {
  let valid = 0;
  const fieldChecks = [
    formSchema.shape.fullName.safeParse(values.fullName).success,
    formSchema.shape.email.safeParse(values.email).success,
    formSchema.shape.phone.safeParse(values.phone).success,
    formSchema.shape.age.safeParse(values.age).success,
    formSchema.shape.role.safeParse(values.role).success,
    formSchema.shape.experience.safeParse(values.experience).success,
    formSchema.shape.skills.safeParse(values.skills).success,
    formSchema.shape.comments.safeParse(values.comments).success,
    formSchema.shape.acceptTerms.safeParse(values.acceptTerms).success,
  ];
  for (const ok of fieldChecks) {
    if (ok) valid += 1;
  }
  return Math.round((valid / fieldChecks.length) * 100);
}

function FormFields({
  values,
  errors,
  touched,
  isSubmitting,
  getFieldProps,
  onSkillToggle,
  onReset,
}) {
  const showError = (name) => (touched[name] ? errors[name] : undefined);
  const progress = countValidFields(values);

  return (
    <>
      <div className="progress-container">
        <div className="progress-label">
          <span>Progreso de validación (Zod)</span>
          <span>{progress}% completado</span>
        </div>
        <div className="progress-track">
          <motion.div
            className="progress-fill"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ type: 'spring', stiffness: 120, damping: 20 }}
          />
        </div>
      </div>

      <div className="form-grid">
        <div className="field-group">
          <label className="field-label" htmlFor="fullName">
            Nombre completo
          </label>
          <input
            id="fullName"
            type="text"
            placeholder="Ej. Ana María López"
            className={`input-control ${showError('fullName') ? 'input-error' : ''}`}
            {...getFieldProps('fullName')}
          />
          <FieldError message={showError('fullName')} />
        </div>

        <div className="field-group">
          <label className="field-label" htmlFor="email">
            Correo electrónico
          </label>
          <input
            id="email"
            type="email"
            placeholder="ana@ejemplo.com"
            className={`input-control ${showError('email') ? 'input-error' : ''}`}
            {...getFieldProps('email')}
          />
          <FieldError message={showError('email')} />
        </div>

        <div className="field-group">
          <label className="field-label" htmlFor="phone">
            Teléfono
          </label>
          <input
            id="phone"
            type="tel"
            placeholder="3001234567"
            className={`input-control ${showError('phone') ? 'input-error' : ''}`}
            {...getFieldProps('phone')}
          />
          <FieldError message={showError('phone')} />
        </div>

        <div className="field-group">
          <label className="field-label" htmlFor="age">
            Edad
          </label>
          <input
            id="age"
            type="number"
            placeholder="22"
            className={`input-control ${showError('age') ? 'input-error' : ''}`}
            {...getFieldProps('age')}
          />
          <FieldError message={showError('age')} />
        </div>

        <div className="field-group full-width">
          <label className="field-label" htmlFor="role">
            Rol principal (Select)
          </label>
          <select
            id="role"
            className={`input-control ${showError('role') ? 'input-error' : ''}`}
            {...getFieldProps('role')}
          >
            <option value="">-- Selecciona un rol --</option>
            {ROLE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <FieldError message={showError('role')} />
        </div>

        <div className="field-group full-width">
          <span className="field-label">Nivel de experiencia (Radio)</span>
          <div className="options-row">
            {EXPERIENCE_OPTIONS.map((opt) => {
              const checked = values.experience === opt.value;
              return (
                <label
                  key={opt.value}
                  className={`option-pill ${checked ? 'selected' : ''}`}
                >
                  <input
                    type="radio"
                    name="experience"
                    value={opt.value}
                    checked={checked}
                    onChange={getFieldProps('experience').onChange}
                    onBlur={getFieldProps('experience').onBlur}
                  />
                  {opt.label}
                </label>
              );
            })}
          </div>
          <FieldError message={showError('experience')} />
        </div>

        <div className="field-group full-width">
          <span className="field-label">Habilidades técnicas (Checkboxes)</span>
          <div className="options-row">
            {SKILL_OPTIONS.map((opt) => {
              const checked = (values.skills || []).includes(opt.value);
              return (
                <label
                  key={opt.value}
                  className={`option-pill ${checked ? 'selected' : ''}`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => onSkillToggle(opt.value)}
                  />
                  {opt.label}
                </label>
              );
            })}
          </div>
          <FieldError message={showError('skills')} />
        </div>

        <div className="field-group full-width">
          <label className="field-label" htmlFor="comments">
            <span>Comentarios / Descripción (TextArea)</span>
            <span className="char-counter">
              {(values.comments || '').length} / 300
            </span>
          </label>
          <textarea
            id="comments"
            rows={4}
            placeholder="Cuéntanos sobre tu experiencia o proyecto..."
            className={`input-control ${showError('comments') ? 'input-error' : ''}`}
            {...getFieldProps('comments')}
          />
          <FieldError message={showError('comments')} />
        </div>

        <div className="field-group full-width">
          <label className="option-pill" style={{ width: 'fit-content' }}>
            <input
              type="checkbox"
              checked={Boolean(values.acceptTerms)}
              onChange={getFieldProps('acceptTerms', true).onChange}
            />
            Acepto la validación de datos antes de enviar al servidor
          </label>
          <FieldError message={showError('acceptTerms')} />
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onReset}>
          <RotateCcw size={16} />
          Limpiar
        </button>
        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 size={16} className="spin" />
              Enviando al backend...
            </>
          ) : (
            <>
              <Send size={16} />
              Enviar formulario
            </>
          )}
        </button>
      </div>
    </>
  );
}

function ReactHookFormView({ onBackendSuccess }) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, touchedFields, isSubmitted, isSubmitting },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: INITIAL_FORM_VALUES,
    mode: 'onTouched',
  });

  // oxlint-disable-next-line react/incompatible-library -- react-hook-form's watch() intentionally subscribes to live form values; this component is not memoized by React Compiler.
  const values = watch();

  const touchedMap = Object.keys(INITIAL_FORM_VALUES).reduce((acc, key) => {
    acc[key] = Boolean(touchedFields[key] || isSubmitted);
    return acc;
  }, {});

  const handleSkillToggle = (skill) => {
    const current = values.skills || [];
    const next = current.includes(skill)
      ? current.filter((item) => item !== skill)
      : [...current, skill];
    setValue('skills', next, { shouldValidate: true, shouldTouch: true });
  };

  const onSubmit = async (validData) => {
    await onBackendSuccess(validData, 'React Hook Form + Zod');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="form-wrapper">
      <FormFields
        values={values}
        errors={Object.fromEntries(
          Object.entries(errors).map(([k, v]) => [k, v?.message])
        )}
        touched={touchedMap}
        isSubmitting={isSubmitting}
        getFieldProps={(name) => register(name)}
        onSkillToggle={handleSkillToggle}
        onReset={() => reset(INITIAL_FORM_VALUES)}
      />
    </form>
  );
}

function FormikView({ onBackendSuccess }) {
  const formik = useFormik({
    initialValues: INITIAL_FORM_VALUES,
    validate: validateWithZod,
    onSubmit: async (values, { setSubmitting }) => {
      const parsed = formSchema.parse(values);
      await onBackendSuccess(parsed, 'Formik + Zod');
      setSubmitting(false);
    },
  });

  const touchedMap = Object.keys(INITIAL_FORM_VALUES).reduce((acc, key) => {
    acc[key] = Boolean(formik.touched[key] || formik.submitCount > 0);
    return acc;
  }, {});

  const handleSkillToggle = (skill) => {
    const current = formik.values.skills || [];
    const next = current.includes(skill)
      ? current.filter((item) => item !== skill)
      : [...current, skill];
    formik.setFieldTouched('skills', true, false);
    formik.setFieldValue('skills', next, true);
  };

  return (
    <form onSubmit={formik.handleSubmit} noValidate className="form-wrapper">
      <FormFields
        values={formik.values}
        errors={formik.errors}
        touched={touchedMap}
        isSubmitting={formik.isSubmitting}
        getFieldProps={(name, isCheckbox) => ({
          name,
          value: formik.values[name],
          checked: isCheckbox ? Boolean(formik.values[name]) : undefined,
          onChange: formik.handleChange,
          onBlur: formik.handleBlur,
        })}
        onSkillToggle={handleSkillToggle}
        onReset={() => formik.resetForm()}
      />
    </form>
  );
}

export default function FormModule() {
  const [engine, setEngine] = useState('rhf');
  const [submission, setSubmission] = useState(null);

  const simulateBackendSend = async (validatedData, engineLabel) => {
    setSubmission(null);
    await new Promise((resolve) => setTimeout(resolve, 900));
    setSubmission({
      engine: engineLabel,
      timestamp: new Date().toLocaleTimeString(),
      status: 200,
      payload: validatedData,
    });
  };

  return (
    <motion.div
      className="form-wrapper"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="form-header">
        <div>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={22} color="#34d399" />
            Formulario Validado (Pre-Backend)
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Validación estricta con <strong>Zod</strong>, animaciones con{' '}
            <strong>Framer Motion</strong> y soporte para{' '}
            <strong>React Hook Form</strong> / <strong>Formik</strong>.
          </p>
        </div>

        <div className="engine-switcher" role="tablist" aria-label="Motor de formulario">
          <button
            type="button"
            className={`engine-btn ${engine === 'rhf' ? 'active' : ''}`}
            onClick={() => {
              setEngine('rhf');
              setSubmission(null);
            }}
          >
            React Hook Form + Zod
          </button>
          <button
            type="button"
            className={`engine-btn ${engine === 'formik' ? 'active' : ''}`}
            onClick={() => {
              setEngine('formik');
              setSubmission(null);
            }}
          >
            Formik + Zod
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={engine}
          initial={{ opacity: 0, x: engine === 'rhf' ? -12 : 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: engine === 'rhf' ? 12 : -12 }}
          transition={{ duration: 0.2 }}
        >
          {engine === 'rhf' ? (
            <ReactHookFormView onBackendSuccess={simulateBackendSend} />
          ) : (
            <FormikView onBackendSuccess={simulateBackendSend} />
          )}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {submission && (
          <motion.div
            className="backend-result"
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.25 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#34d399', fontWeight: 600 }}>
              <CheckCircle2 size={20} />
              <span>
                ¡Validación exitosa y enviado al backend! ({submission.engine} • {submission.timestamp})
              </span>
            </div>
            <pre>{JSON.stringify(submission.payload, null, 2)}</pre>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
