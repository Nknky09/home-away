const createProfileAction = async (FormData: FormData) => {
  "use server";
  const firstName = FormData.get("firstName") as string;
  console.log(firstName);
};

function CreateProfile() {
  return (
    <section>
      <h1 className="text-2xl font-semibold mb-8 capitalize">new user</h1>
      <div className="border p-8 rounded-md max-w-lg">
        <form action={createProfileAction}></form>
      </div>
    </section>
  );
}

export default CreateProfile;
