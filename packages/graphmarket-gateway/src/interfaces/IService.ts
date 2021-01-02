import { ServiceEndpointDefinition } from '@apollo/gateway';

/**
 * Service interface.
 */
export default interface IService extends Required<ServiceEndpointDefinition> {
  features?: {
    authentication?: boolean;
    upload?: boolean;
  };
}
