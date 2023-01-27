import Input from '$/components/input';

export default {
  title: 'Packages/Components/Input',
};

export const Default = () => {
  return (
    <>
      <Input.Container>
        <Input type="test" />
      </Input.Container>
    </>
  );
};
