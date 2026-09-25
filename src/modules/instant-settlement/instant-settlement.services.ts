import { AxiosInstance } from 'axios';
import {
    EligibleListResponseDTO,
    EligibleQueryParams,
    InquiryRequestDTO,
    InquiryResponseDTO,
    SuggestionsRequestDTO,
    SuggestionsDTO,
    CreateRequestDTO,
    CreateRequestResponseDTO,
    RequestsListResponseDTO,
    RequestsQueryParams,
    RequestDetailsDTO,
    RequestDetailsResponseDTO,
    MemberTransactionsResponseDTO,
    MemberTransactionsQueryParams,
} from './dto/instant-settlement.dto';

// ---------------------------------------------------------------------------
// instant-settlements v3 endpoints (confirmed contract — FIN-20275 v3).
// Mounted at /v3/payment/instant-settlements (api-gateway transparent proxy).
// All return raw DTOs; the VM/mapper layer turns them into presentation models.
// ---------------------------------------------------------------------------

const BASE = '/v3/payment/instant-settlements';

/** GET {BASE}/instant/eligible-transactions — list + summary + limits */
export const fetchEligibleTransactions = async (
    api: AxiosInstance,
    params: EligibleQueryParams = {},
): Promise<EligibleListResponseDTO> => {
    const response = await api.get<EligibleListResponseDTO>(
        `${BASE}/instant/eligible-transactions`,
        { params },
    );
    return response.data;
};

/** POST {BASE}/instant/inquiry — fee breakdown (bare object, no envelope) */
export const inquireInstant = async (
    api: AxiosInstance,
    body: InquiryRequestDTO,
): Promise<InquiryResponseDTO> => {
    const response = await api.post<InquiryResponseDTO>(
        `${BASE}/instant/inquiry`,
        body,
    );
    return response.data;
};

/**
 * POST {BASE}/instant/suggestions — custom-amount helper (FIN-20780).
 * Returns the combinations nearest BELOW and ABOVE the target (bare object).
 */
export const fetchSuggestions = async (
    api: AxiosInstance,
    body: SuggestionsRequestDTO,
): Promise<SuggestionsDTO> => {
    const response = await api.post<SuggestionsDTO>(
        `${BASE}/instant/suggestions`,
        body,
    );
    return response.data;
};

/** POST {BASE}/instant-requests — create request (201) */
export const createInstantRequest = async (
    api: AxiosInstance,
    body: CreateRequestDTO,
): Promise<CreateRequestResponseDTO> => {
    const response = await api.post<CreateRequestResponseDTO>(
        `${BASE}/instant-requests`,
        body,
    );
    return response.data;
};

/** GET {BASE}/instant-requests — requests history (paginated) */
export const fetchInstantRequests = async (
    api: AxiosInstance,
    params: RequestsQueryParams = {},
): Promise<RequestsListResponseDTO> => {
    const response = await api.get<RequestsListResponseDTO>(
        `${BASE}/instant-requests`,
        { params },
    );
    return response.data;
};

/**
 * GET {BASE}/instant-requests/{uuid} — details + embedded records.
 * Envelope-wrapped (Codex #1): unwrap `response.data.data` so the mapper
 * receives a plain `RequestDetailsDTO` (matches the other service fns).
 */
export const fetchInstantRequestDetails = async (
    api: AxiosInstance,
    uuid: string,
): Promise<RequestDetailsDTO> => {
    const response = await api.get<RequestDetailsResponseDTO>(
        `${BASE}/instant-requests/${uuid}`,
    );
    return response.data.data;
};

/** GET {BASE}/instant-requests/{uuid}/transactions — member txns (paginated) */
export const fetchInstantRequestTransactions = async (
    api: AxiosInstance,
    uuid: string,
    params: MemberTransactionsQueryParams = {},
): Promise<MemberTransactionsResponseDTO> => {
    const response = await api.get<MemberTransactionsResponseDTO>(
        `${BASE}/instant-requests/${uuid}/transactions`,
        { params },
    );
    return response.data;
};
