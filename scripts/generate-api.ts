import { compile } from 'json-schema-to-typescript';
import { writeFileSync } from 'fs';

const runScript = async (): Promise<void> => {
  const response = await fetch(
    'https://csrc.nist.gov/schema/nvd/api/2.0/cve_api_json_2.0.schema',
  );

  await writeFileSync(
    './src/api/generated/nvdApiTypes.ts',
    await compile(await response.json(), 'nvdAPI'),
  );
};

await runScript();
