using Amazon.Extensions.NETCore.Setup;
using Amazon.SimpleSystemsManagement;
using Amazon.SimpleSystemsManagement.Model;

public class ParameterStoreService
{
    private readonly IAmazonSimpleSystemsManagement _ssmClient;

    public ParameterStoreService(IAmazonSimpleSystemsManagement ssmClient)
    {
        _ssmClient = ssmClient;
    }

    public async Task<Dictionary<string, string>> GetParametersAsync(List<string> parameterNames)
    {
        var request = new GetParametersRequest
        {
            Names = parameterNames,
            WithDecryption = true
        };

        var response = await _ssmClient.GetParametersAsync(request);
        var parameters = new Dictionary<string, string>();

        foreach (var parameter in response.Parameters)
        {
            parameters[parameter.Name] = parameter.Value;
        }

        return parameters;
    }
}

public static class ParameterStoreExtensions
{
    public static async Task<Dictionary<string, string>> AddParameterStoreAsync(this IServiceCollection services, AWSOptions awsOptions, List<string> parameterNames)
    {
        var ssmClient = awsOptions.CreateServiceClient<IAmazonSimpleSystemsManagement>();
        var parameterStoreService = new ParameterStoreService(ssmClient);
        var parameters = await parameterStoreService.GetParametersAsync(parameterNames);
        return parameters;
    }
}